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

    try {
      const admins = await readDB('admins.json');
      const hashedPassword = hashPassword(password);

      if (email === adminEmail) {
        const primaryFromFile = admins.find(a => a.email === email);
        const isEnvMatch = !!adminPassword && password === adminPassword;
        const isFileMatch = !!primaryFromFile?.passwordHash && primaryFromFile.passwordHash === hashedPassword;

        if (!isEnvMatch && !isFileMatch) {
          return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }
      } else {
        const admin = admins.find(a => a.email === email && (a.status === 'approved' || a.status === 'primary'));
        if (!admin || admin.passwordHash !== hashedPassword) {
          return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }
      }

      const token = createSessionToken(email);
      const cookie = getSessionCookieConfig();
      const response = NextResponse.json({ message: 'Login successful' });
      response.cookies.set(cookie.name, token, cookie.options);
      return response;
    } catch (dbErr) {
      if (email === adminEmail && adminPassword && password === adminPassword) {
        const token = createSessionToken(adminEmail);
        const cookie = getSessionCookieConfig();
        const response = NextResponse.json({ message: 'Login successful' });
        response.cookies.set(cookie.name, token, cookie.options);
        return response;
      }

      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
