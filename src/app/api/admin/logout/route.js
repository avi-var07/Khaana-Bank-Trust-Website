import { NextResponse } from 'next/server';
import { getSessionCookieConfig } from '@/lib/adminAuth';

export async function POST() {
  const cookie = getSessionCookieConfig();
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set(cookie.name, '', {
    ...cookie.options,
    maxAge: 0,
  });
  return response;
}
