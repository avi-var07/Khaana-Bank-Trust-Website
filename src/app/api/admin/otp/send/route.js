import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDB, writeDB } from '@/lib/db';
import transporter, { senderAddress } from '@/lib/mailer';

const RESEND_COOLDOWN_MS = 60 * 1000;
const FIRST_BLOCK_MS = 15 * 60 * 1000;
const NEXT_BLOCK_MS = 60 * 60 * 1000;
const MAX_SENDS_PER_WINDOW = 3;

function hashOTP(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request) {
  try {
    const { email, purpose = 'admin-join' } = await request.json();

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { error: 'Email service is not configured on server.' },
        { status: 500 }
      );
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const now = Date.now();

    const limits = await readDB('admin-otp-limits.json');
    const limitKey = `${email}::${purpose}`;
    let limit = limits.find((entry) => entry.key === limitKey);
    if (!limit) {
      limit = {
        key: limitKey,
        email,
        purpose,
        attemptsInWindow: 0,
        windowLevel: 0,
        blockedUntil: 0,
        lastSentAt: 0,
      };
      limits.push(limit);
    }

    if (limit.blockedUntil && now < limit.blockedUntil) {
      const retryAfterSec = Math.ceil((limit.blockedUntil - now) / 1000);
      return NextResponse.json(
        {
          error: 'Too many OTP requests. Try again later.',
          retryAfterSec,
        },
        { status: 429 }
      );
    }

    if (limit.lastSentAt && now - limit.lastSentAt < RESEND_COOLDOWN_MS) {
      const retryAfterSec = Math.ceil((RESEND_COOLDOWN_MS - (now - limit.lastSentAt)) / 1000);
      return NextResponse.json(
        {
          error: 'Please wait before requesting OTP again.',
          retryAfterSec,
        },
        { status: 429 }
      );
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

    limit.attemptsInWindow += 1;
    limit.lastSentAt = now;

    if (limit.attemptsInWindow >= MAX_SENDS_PER_WINDOW) {
      const blockMs = limit.windowLevel === 0 ? FIRST_BLOCK_MS : NEXT_BLOCK_MS;
      limit.blockedUntil = now + blockMs;
      limit.attemptsInWindow = 0;
      limit.windowLevel += 1;
    }

    await writeDB('admin-otp-limits.json', limits);

    await transporter.sendMail({
      from: senderAddress,
      to: email,
      subject: 'Your OTP for Admin Access Request',
      text: `Your OTP to verify admin access request is: ${otp}\n\nThis OTP expires in 10 minutes.\n\nIf you did not request this, ignore this email.`,
    });

    return NextResponse.json({
      message: 'OTP sent to your email',
      resendAvailableInSec: 60,
      sendsLeftInCurrentWindow: MAX_SENDS_PER_WINDOW - limit.attemptsInWindow,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
