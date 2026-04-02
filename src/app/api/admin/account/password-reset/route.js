import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDB, writeDB } from '@/lib/db';
import { getAdminEmail, getAuthenticatedAdminEmail, isAdminAuthenticated } from '@/lib/adminAuth';

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
    if (payload?.purpose !== 'admin-account-reset') return false;
    return payload?.email === email;
  } catch {
    return false;
  }
}

export async function POST(request) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const email = getAuthenticatedAdminEmail(request);
    const { newPassword, verificationToken } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    if (!verifyToken(verificationToken, email)) {
      return NextResponse.json({ error: 'OTP verification required' }, { status: 400 });
    }

    const admins = await readDB('admins.json');
    const idx = admins.findIndex((a) => a.email === email);

    if (idx === -1) {
      admins.push({
        email,
        status: email === getAdminEmail() ? 'primary' : 'approved',
        passwordHash: hashPassword(newPassword),
        passwordUpdatedAt: new Date().toISOString(),
      });
    } else {
      admins[idx].passwordHash = hashPassword(newPassword);
      admins[idx].passwordUpdatedAt = new Date().toISOString();
    }

    await writeDB('admins.json', admins);

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Account password reset error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
