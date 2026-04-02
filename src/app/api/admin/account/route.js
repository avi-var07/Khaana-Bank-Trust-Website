import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { getAdminEmail, getAuthenticatedAdminEmail, isAdminAuthenticated } from '@/lib/adminAuth';

export async function GET(request) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = getAuthenticatedAdminEmail(request);
  const admins = await readDB('admins.json');
  const admin = admins.find((a) => a.email === email);

  return NextResponse.json({
    email,
    phone: admin?.phone || '',
    role: email === getAdminEmail() ? 'primary' : 'approved',
  });
}

export async function PUT(request) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const email = getAuthenticatedAdminEmail(request);
    const { phone } = await request.json();

    if (!phone || String(phone).trim().length < 8) {
      return NextResponse.json({ error: 'Enter a valid phone number' }, { status: 400 });
    }

    const admins = await readDB('admins.json');
    const idx = admins.findIndex((a) => a.email === email);

    if (idx === -1) {
      admins.push({
        email,
        status: email === getAdminEmail() ? 'primary' : 'approved',
        phone: String(phone).trim(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      admins[idx].phone = String(phone).trim();
      admins[idx].updatedAt = new Date().toISOString();
    }

    await writeDB('admins.json', admins);

    return NextResponse.json({ message: 'Phone number updated successfully' });
  } catch (error) {
    console.error('Update phone error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
