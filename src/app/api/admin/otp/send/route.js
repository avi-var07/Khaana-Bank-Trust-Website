import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDB, writeDB } from '@/lib/db';
import transporter from '@/lib/mailer';

function hashOTP(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request) {
  try {
    const { email, purpose = 'admin-join' } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const otp = generateOTP();
    const otpHash = hashOTP(otp);

    const otpEntries = await readDB('admin-otp.json');
    const updated = otpEntries.filter(
      (entry) => !(entry.email === email && entry.purpose === purpose && entry.used === false)
    );

    updated.unshift({
      email,
      purpose,
      otpHash,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000,
      used: false,
      attempts: 0,
    });

    await writeDB('admin-otp.json', updated);

    await transporter.sendMail({
      from: '"Khaana Bank Trust" <info@khaanabanktrust.org>',
      to: email,
      subject: 'Your OTP for Admin Access Request',
      text: `Your OTP to verify admin access request is: ${otp}\n\nThis OTP expires in 10 minutes.\n\nIf you did not request this, ignore this email.`,
    });

    return NextResponse.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
