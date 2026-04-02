import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDB, writeDB } from '@/lib/db';

function hashOTP(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

function createVerificationToken(email, purpose) {
  const payload = {
    email,
    purpose,
    exp: Date.now() + 15 * 60 * 1000,
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
    const { email, otp, purpose = 'admin-join' } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const otpEntries = await readDB('admin-otp.json');
    const target = otpEntries.find(
      (entry) => entry.email === email && entry.purpose === purpose && entry.used === false
    );

    if (!target) {
      return NextResponse.json({ error: 'No active OTP found. Please request a new OTP.' }, { status: 400 });
    }

    if (Date.now() > target.expiresAt) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new OTP.' }, { status: 400 });
    }

    target.attempts = (target.attempts || 0) + 1;
    if (target.attempts > 5) {
      target.used = true;
      await writeDB('admin-otp.json', otpEntries);
      return NextResponse.json({ error: 'Too many attempts. Request a new OTP.' }, { status: 429 });
    }

    const otpHash = hashOTP(String(otp).trim());
    if (otpHash !== target.otpHash) {
      await writeDB('admin-otp.json', otpEntries);
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    target.used = true;
    target.verifiedAt = Date.now();
    await writeDB('admin-otp.json', otpEntries);

    const verificationToken = createVerificationToken(email, purpose);

    return NextResponse.json({
      message: 'Email verified successfully',
      verificationToken,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
