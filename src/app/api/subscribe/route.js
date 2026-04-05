import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import transporter, { senderAddress } from '@/lib/mailer';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function GET() {
  try {
    const subs = await readDB('subscribers.json');
    return NextResponse.json(subs);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, phone } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const subscribers = await readDB('subscribers.json');
    
    // Check if already subscribed
    if (subscribers.find(s => s.email === email)) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }

    const newSubscriber = {
      id: uuidv4(),
      name,
      email,
      phone,
      subscribedAt: new Date().toISOString()
    };

    subscribers.push(newSubscriber);
    await writeDB('subscribers.json', subscribers);

    let emailSent = false;
    let whatsappSent = false;
    const channelErrors = [];

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: senderAddress,
          to: email,
          subject: '🎉 Welcome to Khaana Bank Trust — Thank You for Subscribing!',
          html: `
            <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;padding:0;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
              <!-- Header -->
              <div style="background:linear-gradient(135deg,#FF7043,#E64A19);padding:36px 30px;text-align:center;">
                <h1 style="color:#fff;font-size:26px;margin:0 0 6px;">Welcome to Khaana Bank Trust! 🙏</h1>
                <p style="color:rgba(255,255,255,0.85);font-size:15px;margin:0;">Thank you for joining our mission</p>
              </div>

              <!-- Body -->
              <div style="padding:32px 30px;">
                <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 16px;">
                  Hi <strong>${name}</strong>,
                </p>
                <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 16px;">
                  Thank you for subscribing to <strong>Khaana Bank Trust</strong> updates! We're thrilled to have you as part of our community of changemakers.
                </p>

                <div style="background:#fff7ed;border-left:4px solid #FF7043;padding:16px 20px;border-radius:8px;margin:24px 0;">
                  <p style="margin:0;color:#9a3412;font-size:15px;line-height:1.6;">
                    <strong>What you'll receive:</strong><br/>
                    🗓️ Updates about upcoming <strong>events</strong><br/>
                    📝 New <strong>blog posts</strong> and impact stories<br/>
                    🤝 Opportunities to <strong>volunteer & contribute</strong><br/>
                    📊 Our <strong>impact reports</strong> and achievements
                  </p>
                </div>

                <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 24px;">
                  Together, we can make a difference — one meal, one life at a time.
                </p>

                <div style="text-align:center;margin:28px 0;">
                  <a href="${process.env.APP_URL || 'http://localhost:3000'}/events" style="display:inline-block;background:#FF7043;color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:700;font-size:15px;">
                    Explore Upcoming Events →
                  </a>
                </div>
              </div>

              <!-- Footer -->
              <div style="background:#f9fafb;padding:20px 30px;text-align:center;border-top:1px solid #e5e7eb;">
                <p style="color:#6b7280;font-size:14px;margin:0 0 4px;">
                  With warm regards,
                </p>
                <p style="color:#374151;font-size:15px;font-weight:600;margin:0 0 2px;">
                  Mr. Ankit Tripathi, Founder
                </p>
                <p style="color:#9ca3af;font-size:13px;margin:0;">
                  Khaana Bank Trust • Serving Humanity through Nutrition & Care
                </p>
              </div>
            </div>
          `,
        });
        emailSent = true;
      } catch (err) {
        console.error('Subscribe email error:', err);
        channelErrors.push('email');
      }
    }

    try {
      const waResult = await sendWhatsAppMessage(
        phone,
        `Hi ${name}, welcome to Khaana Bank Trust updates. You will now receive event and donation-drive notifications from us.`
      );
      whatsappSent = waResult.sent;
    } catch (err) {
      console.error('Subscribe WhatsApp error:', err);
      channelErrors.push('whatsapp');
    }

    return NextResponse.json(
      {
        message: 'Subscribed successfully',
        channels: {
          emailSent,
          whatsappSent,
        },
        channelErrors,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Subscription error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
