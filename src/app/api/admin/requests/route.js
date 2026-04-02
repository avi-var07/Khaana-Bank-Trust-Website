import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import transporter from '@/lib/mailer';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { isAdminAuthenticated, getAdminEmail } from '@/lib/adminAuth';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
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
    if (!token || !token.includes('.')) return null;
    const [encoded, signature] = token.split('.');
    const expected = crypto
      .createHmac('sha256', process.env.ADMIN_SESSION_SECRET || 'change-this-admin-session-secret')
      .update(encoded)
      .digest('base64url');
    if (expected !== signature) return null;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload?.exp || Date.now() > payload.exp) return null;
    return payload.email;
  } catch {
    return null;
  }
}

// POST: Create new admin request
export async function POST(request) {
  try {
    const { email, password, requestedBy } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
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
    const approvalLink = `${process.env.APP_URL || 'http://localhost:3000'}/admin/approve?token=${newRequest.token}`;
    const primaryAdmin = getAdminEmail();

    await transporter.sendMail({
      from: '"Khaana Bank Trust" <info@khaanabanktrust.org>',
      to: primaryAdmin,
      subject: `New Admin Access Request: ${email}`,
      text: `A new admin access request has been received.\n\nRequested Email: ${email}\nRequested By: ${requestedBy || email}\nTime: ${new Date().toLocaleString()}\n\nTo approve this request and allow this admin to login, click the link below:\n\n${approvalLink}\n\nThis link expires in 7 days.\n\nIf you did not request this, ignore this email.`,
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

