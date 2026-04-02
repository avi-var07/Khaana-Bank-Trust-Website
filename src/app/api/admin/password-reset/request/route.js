import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '@/lib/db';
import transporter from '@/lib/mailer';
import { getAdminEmail } from '@/lib/adminAuth';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyToken(token, email) {
  try {
    if (!token || !token.includes('.')) return false;
    const [encoded, signature] = token.split('.');
    const expected = crypto
      .createHmac('sha256', process.env.ADMIN_SESSION_SECRET || 'change-this-admin-session-secret')
      .update(encoded)
      .digest('base64url');

    if (expected !== signature) return false;

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload?.exp || Date.now() > payload.exp) return false;
    if (payload?.purpose !== 'admin-reset') return false;
    return payload?.email === email;
  } catch {
    return false;
  }
}

function createApprovalToken(email, resetRequestId) {
  const payload = {
    email,
    resetRequestId,
    purpose: 'admin-reset-approval',
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };

  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', process.env.ADMIN_SESSION_SECRET || 'change-this-admin-session-secret')
    .update(encoded)
    .digest('base64url');

  return `${encoded}.${signature}`;
}

export async function POST(request) {
  try {
    const { email, newPassword, verificationToken } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    if (!verifyToken(verificationToken, email)) {
      return NextResponse.json({ error: 'Email verification is required before reset request' }, { status: 400 });
    }

    const admins = await readDB('admins.json');
    const isPrimary = email === getAdminEmail();
    const existing = admins.find((a) => a.email === email);

    if (!isPrimary && !existing) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 });
    }

    const requests = await readDB('admin-password-reset-requests.json');
    const activeExisting = requests.find((r) => r.email === email && r.status === 'pending');

    if (activeExisting) {
      return NextResponse.json({ error: 'Reset request already pending approval' }, { status: 400 });
    }

    const resetRequestId = uuidv4();
    const passwordHash = hashPassword(newPassword);

    const resetRequest = {
      id: resetRequestId,
      email,
      passwordHash,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    requests.unshift(resetRequest);
    await writeDB('admin-password-reset-requests.json', requests);

    const approvalToken = createApprovalToken(email, resetRequestId);
    const approvalLink = `${process.env.APP_URL || 'http://localhost:3000'}/admin/reset-password-approve?token=${approvalToken}`;

    await transporter.sendMail({
      from: '"Khaana Bank Trust" <info@khaanabanktrust.org>',
      to: getAdminEmail(),
      subject: `Admin Password Reset Approval Required: ${email}`,
      text: `A password reset request has been submitted.\n\nAdmin Email: ${email}\nTime: ${new Date().toLocaleString()}\n\nApprove here:\n${approvalLink}\n\nThis link expires in 24 hours.`,
    });

    return NextResponse.json({
      message: 'Password reset request sent to primary admin for approval',
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
