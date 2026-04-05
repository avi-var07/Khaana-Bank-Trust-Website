import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import transporter, { senderAddress } from '@/lib/mailer';
import crypto from 'crypto';
import { getAdminEmail } from '@/lib/adminAuth';

function verifyApprovalToken(token) {
  try {
    if (!token || !token.includes('.')) {
      console.error('Invalid token format: missing dot');
      return null;
    }
    const [encoded, signature] = token.split('.');
    const secret = process.env.ADMIN_SESSION_SECRET || 'change-this-admin-session-secret';
    if (!process.env.ADMIN_SESSION_SECRET) {
      console.warn('Warning: ADMIN_SESSION_SECRET is not set, using default fallback.');
    }
    
    const expected = crypto
      .createHmac('sha256', secret)
      .update(encoded)
      .digest('base64url');
      
    if (expected !== signature) {
      console.error('Token signature mismatch - Check ADMIN_SESSION_SECRET');
      return null;
    }
    
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload?.exp || Date.now() > payload.exp) {
      console.error('Token expired');
      return null;
    }
    return payload.email;
  } catch (err) {
    console.error('Token verification error:', err);
    return null;
  }
}

// POST: Reject the admin request
export async function POST(request) {
  try {
    const { token, reason } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Invalid rejection link' }, { status: 400 });
    }

    const email = verifyApprovalToken(token);
    if (!email) {
      return NextResponse.json({ error: 'Link expired or invalid' }, { status: 400 });
    }

    const requests = await readDB('admin-requests.json');
    const request_obj = requests.find(r => r.email === email && r.status === 'pending');

    if (!request_obj) {
      return NextResponse.json({ error: 'Request not found or already processed' }, { status: 404 });
    }

    // Update request status to rejected
    request_obj.status = 'rejected';
    request_obj.rejectedAt = new Date().toISOString();
    request_obj.rejectedBy = getAdminEmail();
    request_obj.rejectionReason = reason || 'No reason provided';
    await writeDB('admin-requests.json', requests);

    const reasonText = reason
      ? `<p style="color:#374151;font-size:16px;line-height:1.7;"><strong>Reason:</strong> ${reason}</p>`
      : '';

    // Send rejection email to the requesting user
    await transporter.sendMail({
      from: senderAddress,
      to: email,
      subject: '❌ Admin Access Request — Not Approved',
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;padding:40px 30px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;">
          <div style="text-align:center;margin-bottom:30px;">
            <h1 style="color:#dc2626;font-size:28px;margin:0;">Request Not Approved</h1>
          </div>
          <p style="color:#374151;font-size:16px;line-height:1.7;">Dear <strong>${email}</strong>,</p>
          <p style="color:#374151;font-size:16px;line-height:1.7;">
            We regret to inform you that your request to join as an Admin of <strong>Khaana Bank Trust</strong> has been <span style="color:#dc2626;font-weight:700;">declined</span> by the primary administrator.
          </p>
          ${reasonText}
          <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:16px 20px;border-radius:8px;margin:24px 0;">
            <p style="margin:0;color:#991b1b;font-size:15px;">
              If you believe this was a mistake, please contact the primary admin at <strong>${getAdminEmail()}</strong>.
            </p>
          </div>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;" />
          <p style="color:#9ca3af;font-size:13px;text-align:center;">Khaana Bank Trust • Serving Humanity through Nutrition & Care</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: 'Admin request rejected.',
      email,
    });
  } catch (err) {
    console.error('Rejection error:', err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
