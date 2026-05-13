import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import transporter, { senderAddress } from '@/lib/mailer';
import { enforceRateLimit } from '@/lib/rateLimit';

export async function GET() {
  try {
    const volunteers = await readDB('volunteers.json');
    return NextResponse.json(volunteers);
  } catch {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function POST(request) {
  const rate = await enforceRateLimit(request, {
    key: 'public-volunteer',
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (rate.blocked) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Please try again later.', retryAfterSec: rate.retryAfterSec },
      { status: 429 }
    );
  }

  try {
    const { name, email, phone, eventType, eventId, preferredDate, message } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Name, email, and phone are required.' }, { status: 400 });
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const volunteers = await readDB('volunteers.json');

    // Check for duplicate registration (same email + eventType within last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const duplicate = volunteers.find(
      v => v.email === email && v.eventType === eventType && v.registeredAt > thirtyDaysAgo
    );
    if (duplicate) {
      return NextResponse.json(
        { message: 'You are already registered for this type of event. We will contact you soon!' },
        { status: 200 }
      );
    }

    const newVolunteer = {
      id: uuidv4(),
      name,
      email,
      phone,
      eventType: eventType || 'General',
      eventId: eventId || null,
      preferredDate: preferredDate || 'flexible',
      message: message || '',
      status: 'pending',
      registeredAt: new Date().toISOString(),
    };

    volunteers.unshift(newVolunteer);
    await writeDB('volunteers.json', volunteers);

    // Send confirmation email
    let emailSent = false;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: senderAddress,
          to: email,
          subject: '🎉 Volunteer Registration Confirmed — Khaana Bank Trust',
          html: `
            <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
              <div style="background:linear-gradient(135deg,#FF7043,#E64A19);padding:36px 30px;text-align:center;">
                <h1 style="color:#fff;font-size:24px;margin:0 0 6px;">Welcome Aboard, Volunteer! 🙌</h1>
                <p style="color:rgba(255,255,255,0.85);font-size:15px;margin:0;">Thank you for stepping up to make a difference</p>
              </div>
              <div style="padding:32px 30px;">
                <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 16px;">
                  Hi <strong>${name}</strong>,
                </p>
                <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 16px;">
                  Your volunteer registration has been received! Here are the details:
                </p>
                <div style="background:#fff7ed;border-left:4px solid #FF7043;padding:16px 20px;border-radius:8px;margin:24px 0;">
                  <p style="margin:0;color:#9a3412;font-size:15px;line-height:1.8;">
                    <strong>Event Type:</strong> ${eventType || 'General'}<br/>
                    <strong>Preferred Date:</strong> ${preferredDate || 'Flexible'}<br/>
                    <strong>Status:</strong> Pending Review
                  </p>
                </div>
                <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 24px;">
                  Our team will reach out to you shortly with more details. Together, we can create a meaningful impact! 💪
                </p>
                <div style="text-align:center;margin:28px 0;">
                  <a href="${process.env.APP_URL || 'http://localhost:3000'}/events" style="display:inline-block;background:#FF7043;color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:700;font-size:15px;">
                    View Upcoming Events →
                  </a>
                </div>
              </div>
              <div style="background:#f9fafb;padding:20px 30px;text-align:center;border-top:1px solid #e5e7eb;">
                <p style="color:#6b7280;font-size:14px;margin:0 0 4px;">With warm regards,</p>
                <p style="color:#374151;font-size:15px;font-weight:600;margin:0 0 2px;">Mr. Ankit Tripathi, Founder</p>
                <p style="color:#9ca3af;font-size:13px;margin:0;">Khaana Bank Trust • Serving Humanity through Nutrition & Care</p>
              </div>
            </div>
          `,
        });
        emailSent = true;
      } catch (err) {
        console.error('Volunteer email error:', err);
      }
    }

    return NextResponse.json(
      {
        message: 'Volunteer registration successful! We will contact you soon.',
        volunteer: { id: newVolunteer.id, name, eventType: newVolunteer.eventType },
        emailSent,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Volunteer registration error:', err);
    return NextResponse.json({ error: 'Unable to process registration. Please try again.' }, { status: 500 });
  }
}
