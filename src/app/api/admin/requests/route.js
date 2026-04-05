import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import transporter, { senderAddress } from '@/lib/mailer';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { isAdminAuthenticated, getAdminEmail } from '@/lib/adminAuth';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyEmailVerificationToken(token, email) {
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
    if (payload?.purpose !== 'admin-join') return false;
    return payload?.email === email;
  } catch {
    return false;
  }
}

function generateApprovalToken(email) {
  const payload = {
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', process.env.ADMIN_SESSION_SECRET || 'change-this-admin-session-secret')
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${signature}`;
}

function verifyApprovalToken(token) {
  try {
    if (!token || !token.includes('.')) {
      console.error('Invalid token format: missing dot');
      return null;
    }
    const [encoded, signature] = token.split('.');
    const secret = process.env.ADMIN_SESSION_SECRET || 'change-this-admin-session-secret';
    if (!process.env.ADMIN_SESSION_SECRET) {
      console.warn('Warning: ADMIN_SESSION_SECRET is not set, using default fallback.');
    }
    
    const expected = crypto
      .createHmac('sha256', secret)
      .update(encoded)
      .digest('base64url');
      
    if (expected !== signature) {
      console.error('Token signature mismatch');
      return null;
    }
    
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload?.exp || Date.now() > payload.exp) {
      console.error('Token expired');
      return null;
    }
    return payload.email;
  } catch (err) {
    console.error('Token verification error:', err);
    return null;
  }
}

// POST: Create new admin request
export async function POST(request) {
  try {
    const { email, password, requestedBy, verificationToken } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    if (!verifyEmailVerificationToken(verificationToken, email)) {
      return NextResponse.json(
        { error: 'Email verification is required before submitting request' },
        { status: 400 }
      );
    }

    // Check if already approved
    const admins = await readDB('admins.json');
    if (admins.find(a => a.email === email)) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
    }

    // Check if request already pending
    const requests = await readDB('admin-requests.json');
    if (requests.find(r => r.email === email && r.status === 'pending')) {
      return NextResponse.json({ error: 'Request already pending' }, { status: 400 });
    }

    // Create request with hashed password
    const hashedPassword = hashPassword(password);
    const newRequest = {
      id: uuidv4(),
      email,
      passwordHash: hashedPassword,
      requestedBy: requestedBy || email,
      status: 'pending',
      createdAt: new Date().toISOString(),
      token: generateApprovalToken(email),
    };

    requests.unshift(newRequest);
    await writeDB('admin-requests.json', requests);

    // Send approval email to primary admin
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
    const approvalLink = `${baseUrl}/admin/approve?token=${newRequest.token}`;
    const primaryAdmin = getAdminEmail();

    await transporter.sendMail({
      from: senderAddress,
      to: primaryAdmin,
      subject: `New Admin Access Request: ${email}`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;padding:40px 30px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#1f2937;font-size:24px;margin:0;">New Admin Access Request</h1>
          </div>
          <p style="color:#374151;font-size:16px;line-height:1.7;">A new request to join as Admin has been received:</p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin:20px 0;">
            <p style="margin:0 0 8px;color:#6b7280;font-size:14px;"><strong>Email:</strong> ${email}</p>
            <p style="margin:0 0 8px;color:#6b7280;font-size:14px;"><strong>Requested By:</strong> ${requestedBy || email}</p>
            <p style="margin:0;color:#6b7280;font-size:14px;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color:#374151;font-size:16px;line-height:1.7;">Click below to review and accept or reject this request:</p>
          <div style="text-align:center;margin:28px 0;">
            <a href="${approvalLink}" style="display:inline-block;background:linear-gradient(135deg,#FF7043,#E64A19);color:#fff;text-decoration:none;padding:16px 40px;border-radius:50px;font-weight:700;font-size:16px;">
              Review Request →
            </a>
          </div>
          <p style="color:#9ca3af;font-size:13px;text-align:center;">This link expires in 7 days. If you did not expect this, ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="color:#9ca3af;font-size:12px;text-align:center;">Khaana Bank Trust • Serving Humanity through Nutrition & Care</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: 'Request sent to primary admin for approval.',
      requestId: newRequest.id,
    });
  } catch (err) {
    console.error('Admin request error:', err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

// GET: View pending requests (only for primary admin)
export async function GET(request) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const requests = await readDB('admin-requests.json');
  const pendingRequests = requests.filter(r => r.status === 'pending').map(r => ({
    id: r.id,
    email: r.email,
    requestedBy: r.requestedBy,
    createdAt: r.createdAt,
    status: r.status,
    token: r.token,
  }));

  return NextResponse.json(pendingRequests);
}

