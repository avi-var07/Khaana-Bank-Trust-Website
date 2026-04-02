import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDB } from '@/lib/db';
import {
  createSessionToken,
  getAdminEmail,
  getAdminPassword,
  getSessionCookieConfig,
} from '@/lib/adminAuth';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = getAdminEmail();
    const adminPassword = getAdminPassword();

    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin password is not configured on server.' },
        { status: 500 }
      );
    }

    // Check primary admin
    if (email === adminEmail && password === adminPassword) {
      const token = createSessionToken(adminEmail);
      const cookie = getSessionCookieConfig();
      const response = NextResponse.json({ message: 'Login successful' });
      response.cookies.set(cookie.name, token, cookie.options);
      return response;
    }

    // Check approved secondary admins
    try {
      const admins = await readDB('admins.json');
      const admin = admins.find(a => a.email === email && a.status === 'approved');

      if (!admin) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const hashedPassword = hashPassword(password);
      if (admin.passwordHash !== hashedPassword) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const token = createSessionToken(email);
      const cookie = getSessionCookieConfig();
      const response = NextResponse.json({ message: 'Login successful' });
      response.cookies.set(cookie.name, token, cookie.options);
      return response;
    } catch (dbErr) {
      // If admins.json doesn't exist or has issues, primary admin still works
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
