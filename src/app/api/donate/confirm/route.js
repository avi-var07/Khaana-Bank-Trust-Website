import { NextResponse } from 'next/server';
import transporter from '@/lib/mailer';

export async function POST(request) {
  try {
    const { name, email, amount, paymentId } = await request.json();

    if (!email || !amount || !paymentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { error: 'Email sender is not configured on server.' },
        { status: 501 }
      );
    }

    const donorName = name || 'Supporter';

    await transporter.sendMail({
      from: '"Khaana Bank Trust" <info@khaanabanktrust.org>',
      to: email,
      subject: 'Thank you for your donation to Khaana Bank Trust',
      text: `Hi ${donorName},\n\nThank you for your donation of INR ${amount} to Khaana Bank Trust.\n\nPayment ID: ${paymentId}\n\nYour support helps us run meals, education, blood donation, and community initiatives.\n\nWith gratitude,\nKhaana Bank Trust Team`,
    });

    return NextResponse.json({ message: 'Thank-you email sent successfully.' });
  } catch (err) {
    console.error('Donation confirmation email error:', err);
    return NextResponse.json({ error: 'Failed to send thank-you email' }, { status: 500 });
  }
}
