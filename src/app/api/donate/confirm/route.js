import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import transporter, { senderAddress } from '@/lib/mailer';

export async function POST(request) {
  try {
    const { name, email, amount, paymentId, phone } = await request.json();

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
    const donationDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const donationTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Save donation to DB
    try {
      const donations = await readDB('donations.json');
      donations.unshift({
        id: uuidv4(),
        name: donorName,
        email,
        phone: phone || '',
        amount: parseInt(amount),
        paymentId,
        createdAt: new Date().toISOString(),
      });
      await writeDB('donations.json', donations);
    } catch (dbErr) {
      console.error('Failed to save donation record:', dbErr);
      // Don't block email on DB failure
    }

    // Send professional acknowledgement & receipt email
    await transporter.sendMail({
      from: senderAddress,
      to: email,
      subject: `🙏 Donation Receipt — ₹${amount} — Khaana Bank Trust`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:580px;margin:0 auto;padding:0;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#FF7043,#E64A19);padding:36px 30px;text-align:center;">
            <h1 style="color:#fff;font-size:26px;margin:0 0 6px;">Thank You for Your Generosity! 🙏</h1>
            <p style="color:rgba(255,255,255,0.85);font-size:15px;margin:0;">Your donation makes a real difference</p>
          </div>

          <!-- Body -->
          <div style="padding:32px 30px;">
            <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 16px;">
              Dear <strong>${donorName}</strong>,
            </p>
            <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 20px;">
              On behalf of <strong>Mr. Ankit Tripathi, Founder</strong> of Khaana Bank Trust, we sincerely thank you for your generous contribution. Your support directly empowers our mission to serve the underprivileged through food distribution, blood donation drives, education, and environmental conservation.
            </p>

            <!-- Receipt Card -->
            <div style="background:#f8fafc;border:2px solid #e2e8f0;border-radius:12px;padding:28px 24px;margin:24px 0;">
              <h2 style="color:#1e293b;font-size:18px;margin:0 0 20px;text-align:center;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #e2e8f0;padding-bottom:14px;">
                Donation Receipt
              </h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0;color:#6b7280;font-size:14px;vertical-align:top;">Donor Name</td>
                  <td style="padding:10px 0;color:#1f2937;font-size:14px;font-weight:600;text-align:right;">${donorName}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#6b7280;font-size:14px;border-top:1px solid #f1f5f9;vertical-align:top;">Amount</td>
                  <td style="padding:10px 0;color:#FF7043;font-size:22px;font-weight:800;text-align:right;border-top:1px solid #f1f5f9;">₹${parseInt(amount).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#6b7280;font-size:14px;border-top:1px solid #f1f5f9;vertical-align:top;">Payment ID</td>
                  <td style="padding:10px 0;color:#1f2937;font-size:13px;font-weight:600;text-align:right;border-top:1px solid #f1f5f9;word-break:break-all;">${paymentId}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#6b7280;font-size:14px;border-top:1px solid #f1f5f9;vertical-align:top;">Date</td>
                  <td style="padding:10px 0;color:#1f2937;font-size:14px;font-weight:600;text-align:right;border-top:1px solid #f1f5f9;">${donationDate} at ${donationTime}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#6b7280;font-size:14px;border-top:1px solid #f1f5f9;vertical-align:top;">Organization</td>
                  <td style="padding:10px 0;color:#1f2937;font-size:14px;font-weight:600;text-align:right;border-top:1px solid #f1f5f9;">Khaana Bank Trust</td>
                </tr>
              </table>
            </div>

            <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:16px 20px;border-radius:8px;margin:24px 0;">
              <p style="margin:0;color:#166534;font-size:15px;line-height:1.6;">
                <strong>Your impact:</strong> Every rupee you contribute helps us provide meals to the hungry, run blood donation camps, support children's education, and plant trees for a greener future. 🌱
              </p>
            </div>

            <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:20px 0 0;">
              Please retain this email as your donation receipt for your records. For any queries regarding your donation, feel free to contact us at <a href="mailto:khaanabanktrust@gmail.com" style="color:#FF7043;text-decoration:none;font-weight:600;">khaanabanktrust@gmail.com</a> or WhatsApp <a href="https://wa.me/918840775823" style="color:#FF7043;text-decoration:none;font-weight:600;">+91 8840775823</a>.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#f9fafb;padding:24px 30px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="color:#6b7280;font-size:14px;margin:0 0 4px;">
              With heartfelt gratitude,
            </p>
            <p style="color:#374151;font-size:16px;font-weight:700;margin:0 0 2px;">
              Mr. Ankit Tripathi
            </p>
            <p style="color:#6b7280;font-size:14px;margin:0 0 8px;">
              Founder, Khaana Bank Trust
            </p>
            <p style="color:#9ca3af;font-size:12px;margin:0;">
              H.no 1, Tripathi Bhawan, Mainatali Mughalsarai, District-Chandauli, PIN 232101
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Donation receipt email sent successfully.' });
  } catch (err) {
    console.error('Donation confirmation email error:', err);
    return NextResponse.json({ error: 'Failed to send receipt email' }, { status: 500 });
  }
}
