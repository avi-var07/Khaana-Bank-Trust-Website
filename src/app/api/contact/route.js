import { NextResponse } from 'next/server';
import transporter from '@/lib/mailer';

export async function POST(request) {
  try {
    const { fullName, phone, email, subject, message } = await request.json();

    if (!fullName || !phone || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const destination = process.env.CONTACT_RECEIVER_EMAIL || 'khaanabanktrust@gmail.com';

    await transporter.sendMail({
      from: '"Khaana Bank Trust Website" <info@khaanabanktrust.org>',
      to: destination,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: `New message from website contact form\n\nName: ${fullName}\nPhone: ${phone}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: '"Khaana Bank Trust" <info@khaanabanktrust.org>',
      to: email,
      subject: 'We received your message - Khaana Bank Trust',
      text: `Hi ${fullName},\n\nThank you for reaching out to Khaana Bank Trust. We have received your message and our team will get back to you soon.\n\nYour details:\n- Subject: ${subject}\n- Phone: ${phone}\n\nWarm regards,\nKhaana Bank Trust Team\nEmail: khaanabanktrust@gmail.com`,
    });

    return NextResponse.json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Unable to send message right now. Please try again later.' }, { status: 500 });
  }
}
