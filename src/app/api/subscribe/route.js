import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import transporter from '@/lib/mailer';
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
          from: '"Khaana Bank Trust" <info@khaanabanktrust.org>',
          to: email,
          subject: 'Welcome to Khaana Bank Trust Updates',
          text: `Hi ${name},\n\nThank you for subscribing to Khaana Bank Trust updates. You will now receive event and impact notifications from us.\n\nWarm regards,\nKhaana Bank Trust Team`,
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
