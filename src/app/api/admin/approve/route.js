import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import transporter from '@/lib/mailer';
import crypto from 'crypto';
import { getAdminEmail } from '@/lib/adminAuth';

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Invalid approval link' }, { status: 400 });
    }

    const email = verifyApprovalToken(token);
    if (!email) {
      return NextResponse.json({ error: 'Link expired or invalid' }, { status: 400 });
    }

    // Check if already approved
    const admins = await readDB('admins.json');
    if (admins.find(a => a.email === email)) {
      return NextResponse.json({ error: 'Admin already approved' }, { status: 400 });
    }

    // Find and approve the request
    const requests = await readDB('admin-requests.json');
    const request_obj = requests.find(r => r.email === email && r.status === 'pending');

    if (!request_obj) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Add to admins with password hash
    const newAdmin = {
      email,
      passwordHash: request_obj.passwordHash,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: getAdminEmail(),
    };

    admins.push(newAdmin);
    await writeDB('admins.json', admins);

    // Update request status
    request_obj.status = 'approved';
    request_obj.approvedAt = new Date().toISOString();
    await writeDB('admin-requests.json', requests);

    // Send confirmation email to new admin
    await transporter.sendMail({
      from: '"Khaana Bank Trust" <info@khaanabanktrust.org>',
      to: email,
      subject: 'Admin Access Approved ✓',
      text: `Your admin access request has been approved!\n\nYou can now login at:\n${process.env.APP_URL || 'http://localhost:3000'}/admin/login\n\nEmail: ${email}\nPassword: The password you set during registration\n\nIf you forgot your password, please contact the primary admin or request a password reset.\n\nThank you!`,
    });

    return NextResponse.json({
      message: 'Admin approved successfully!',
      email,
    });
  } catch (err) {
    console.error('Approval error:', err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
