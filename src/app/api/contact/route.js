import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '@/lib/db';
import transporter, { senderAddress } from '@/lib/mailer';

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
    const emailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

    let adminEmailSent = false;
    let autoReplySent = false;
    const channelErrors = [];

    if (emailConfigured) {
      try {
        await transporter.sendMail({
          from: senderAddress,
          to: destination,
          replyTo: email,
          subject: `Contact Form: ${subject}`,
          text: `New message from website contact form\n\nName: ${fullName}\nPhone: ${phone}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        });
        adminEmailSent = true;
      } catch (err) {
        channelErrors.push('admin-email');
        console.error('Contact admin email error:', err);
      }

      try {
        await transporter.sendMail({
          from: senderAddress,
          to: email,
          subject: 'We received your message - Khaana Bank Trust',
          text: `Hi ${fullName},\n\nThank you for reaching out to Khaana Bank Trust. We have received your message and our team will get back to you soon.\n\nYour details:\n- Subject: ${subject}\n- Phone: ${phone}\n\nWarm regards,\nKhaana Bank Trust Team\nEmail: khaanabanktrust@gmail.com`,
        });
        autoReplySent = true;
      } catch (err) {
        channelErrors.push('auto-reply');
        console.error('Contact auto-reply error:', err);
      }
    } else {
      channelErrors.push('email-not-configured');
    }

    const submissions = await readDB('contacts.json');
    submissions.unshift({
      id: uuidv4(),
      fullName,
      phone,
      email,
      subject,
      message,
      adminEmailSent,
      autoReplySent,
      channelErrors,
      createdAt: new Date().toISOString(),
    });
    await writeDB('contacts.json', submissions);

    if (!adminEmailSent) {
      return NextResponse.json({
        message: 'Message saved successfully. We will contact you shortly.',
      });
    }

    return NextResponse.json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Unable to send message right now. Please try again later.' }, { status: 500 });
  }
}
