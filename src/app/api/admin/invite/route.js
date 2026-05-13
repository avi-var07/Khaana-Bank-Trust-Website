import { NextResponse } from 'next/server';
import crypto from 'crypto';
import transporter, { senderAddress } from '@/lib/mailer';
import { readDB, writeDB } from '@/lib/db';
import { enforceRateLimit } from '@/lib/rateLimit';
import { hashPassword } from '@/lib/password';
import { getAdminEmail, getAuthenticatedAdminEmail, isAdminAuthenticated } from '@/lib/adminAuth';

export const runtime = 'nodejs';

function isValidEmail(email) {
  return !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getBaseUrl(request) {
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
  return process.env.APP_URL || `${protocol}://${host}`;
}

function hasExpired(expiresAt) {
  return Date.now() > new Date(expiresAt).getTime();
}

export async function POST(request) {
  // Only logged-in primary admin can invite new admins.
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const currentAdminEmail = getAuthenticatedAdminEmail(request);
  if (currentAdminEmail !== getAdminEmail()) {
    return NextResponse.json({ error: 'Only primary admin can invite admins.' }, { status: 403 });
  }

  const rate = await enforceRateLimit(request, {
    key: 'admin-invite-create',
    limit: 10,
    windowMs: 60 * 60 * 1000,
  });
  if (rate.blocked) {
    return NextResponse.json(
      { error: 'Too many invite attempts. Try again later.', retryAfterSec: rate.retryAfterSec },
      { status: 429 }
    );
  }

  try {
    const { email } = await request.json();

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const admins = await readDB('admins.json');
    if (admins.find((a) => a.email.toLowerCase() === normalizedEmail)) {
      return NextResponse.json({ error: 'This email is already an admin.' }, { status: 409 });
    }

    const invites = await readDB('admin-invites.json');

    // Prevent duplicate active invites for the same email.
    const activeInvite = invites.find(
      (invite) =>
        invite.email.toLowerCase() === normalizedEmail &&
        !invite.isUsed &&
        !hasExpired(invite.expiresAt)
    );

    if (activeInvite) {
      return NextResponse.json(
        {
          error: 'An active invite already exists for this email.',
          expiresAt: activeInvite.expiresAt,
        },
        { status: 409 }
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const invite = {
      email: normalizedEmail,
      token,
      expiresAt,
      isUsed: false,
      createdAt: new Date().toISOString(),
      createdBy: currentAdminEmail,
    };

    invites.unshift(invite);
    await writeDB('admin-invites.json', invites);

    const setupLink = `${getBaseUrl(request)}/admin-setup?token=${token}`;

    await transporter.sendMail({
      from: senderAddress,
      to: normalizedEmail,
      subject: 'Admin Invite - Khaana Bank Trust',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="margin:0 0 12px;color:#1f2937;">You are invited as an Admin</h2>
          <p style="color:#374151;line-height:1.6;">You have been invited to join <strong>Khaana Bank Trust</strong> admin panel.</p>
          <p style="color:#374151;line-height:1.6;">This invite is valid for 24 hours and can be used only once.</p>
          <div style="margin:24px 0;">
            <a href="${setupLink}" style="background:#FF7043;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:700;display:inline-block;">Set Up Admin Account</a>
          </div>
          <p style="font-size:13px;color:#6b7280;word-break:break-all;">If button does not work, use this link:<br/>${setupLink}</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: 'Admin invite sent successfully.',
      email: normalizedEmail,
      expiresAt,
    });
  } catch (error) {
    console.error('Create invite error:', error);
    return NextResponse.json({ error: 'Failed to create admin invite.' }, { status: 500 });
  }
}

export async function GET(request) {
  // Token verification endpoint used by /admin-setup page.
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token') || '';

    if (!token) {
      return NextResponse.json({ error: 'Invite token is required.' }, { status: 400 });
    }

    const invites = await readDB('admin-invites.json');
    const invite = invites.find((row) => row.token === token);

    if (!invite) {
      return NextResponse.json({ error: 'Invalid invite link.' }, { status: 404 });
    }

    if (invite.isUsed) {
      return NextResponse.json({ error: 'This invite has already been used.' }, { status: 410 });
    }

    if (hasExpired(invite.expiresAt)) {
      return NextResponse.json({ error: 'This invite has expired.' }, { status: 410 });
    }

    return NextResponse.json({
      email: invite.email,
      expiresAt: invite.expiresAt,
      valid: true,
    });
  } catch (error) {
    console.error('Verify invite error:', error);
    return NextResponse.json({ error: 'Failed to verify invite.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const rate = await enforceRateLimit(request, {
    key: 'admin-invite-consume',
    limit: 20,
    windowMs: 60 * 60 * 1000,
  });
  if (rate.blocked) {
    return NextResponse.json(
      { error: 'Too many setup attempts. Try again later.', retryAfterSec: rate.retryAfterSec },
      { status: 429 }
    );
  }

  try {
    const { token, password } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Invite token is required.' }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const invites = await readDB('admin-invites.json');
    const invite = invites.find((row) => row.token === token);

    if (!invite) {
      return NextResponse.json({ error: 'Invalid invite link.' }, { status: 404 });
    }

    if (invite.isUsed) {
      return NextResponse.json({ error: 'This invite has already been used.' }, { status: 410 });
    }

    if (hasExpired(invite.expiresAt)) {
      return NextResponse.json({ error: 'This invite has expired.' }, { status: 410 });
    }

    const admins = await readDB('admins.json');
    if (admins.find((a) => a.email.toLowerCase() === invite.email.toLowerCase())) {
      invite.isUsed = true;
      invite.usedAt = new Date().toISOString();
      await writeDB('admin-invites.json', invites);
      return NextResponse.json({ error: 'Admin account already exists for this email.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    admins.push({
      email: invite.email,
      passwordHash,
      status: 'approved',
      role: 'admin',
      approvedAt: new Date().toISOString(),
      approvedBy: invite.createdBy || getAdminEmail(),
    });

    invite.isUsed = true;
    invite.usedAt = new Date().toISOString();

    await writeDB('admins.json', admins);
    await writeDB('admin-invites.json', invites);

    return NextResponse.json({ message: 'Admin account created successfully.' });
  } catch (error) {
    console.error('Consume invite error:', error);
    return NextResponse.json({ error: 'Failed to complete admin setup.' }, { status: 500 });
  }
}
