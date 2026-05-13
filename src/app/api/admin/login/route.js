import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import {
  createSessionToken,
  getAdminEmail,
  getAdminPassword,
  getSessionCookieConfig,
} from '@/lib/adminAuth';
import { enforceRateLimit } from '@/lib/rateLimit';
import { verifyPassword } from '@/lib/password';

export async function POST(request) {
  const rate = await enforceRateLimit(request, {
    key: 'admin-login',
    limit: 15,
    windowMs: 15 * 60 * 1000,
  });
  if (rate.blocked) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again later.', retryAfterSec: rate.retryAfterSec },
      { status: 429 }
    );
  }

  try {
    const { email, password } = await request.json();

    const adminEmail = getAdminEmail();
    const adminPassword = getAdminPassword();

    try {
      const admins = await readDB('admins.json');

      if (email === adminEmail) {
        const primaryFromFile = admins.find(a => a.email === email);
        const isEnvMatch = !!adminPassword && password === adminPassword;
        const isFileMatch = !!primaryFromFile?.passwordHash && await verifyPassword(password, primaryFromFile.passwordHash);

        if (!isEnvMatch && !isFileMatch) {
          return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }
      } else {
        const admin = admins.find(a => a.email === email && (a.status === 'approved' || a.status === 'primary'));
        const isMatch = admin?.passwordHash ? await verifyPassword(password, admin.passwordHash) : false;
        if (!admin || !isMatch) {
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
