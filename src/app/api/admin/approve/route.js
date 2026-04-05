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

// GET: Fetch request info for the approve/reject page
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Invalid approval link' }, { status: 400 });
    }

    const email = verifyApprovalToken(token);
    if (!email) {
      return NextResponse.json({ error: 'Link expired or invalid' }, { status: 400 });
    }

    const admins = await readDB('admins.json');
    if (admins.find(a => a.email === email)) {
      return NextResponse.json({ error: 'Admin already approved', alreadyApproved: true }, { status: 400 });
    }

    const requests = await readDB('admin-requests.json');
    const request_obj = requests.find(r => r.email === email && r.status === 'pending');

    if (!request_obj) {
      return NextResponse.json({ error: 'Request not found or already processed' }, { status: 404 });
    }

    return NextResponse.json({
      email: request_obj.email,
      requestedBy: request_obj.requestedBy,
      createdAt: request_obj.createdAt,
      status: request_obj.status,
    });
  } catch (err) {
    console.error('Approval info error:', err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

// POST: Approve the admin request
export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Invalid approval link' }, { status: 400 });
    }

    const email = verifyApprovalToken(token);
    if (!email) {
      return NextResponse.json({ error: 'Link expired or invalid' }, { status: 400 });
    }

    const admins = await readDB('admins.json');
    if (admins.find(a => a.email === email)) {
      return NextResponse.json({ error: 'Admin already approved' }, { status: 400 });
    }

    const requests = await readDB('admin-requests.json');
    const request_obj = requests.find(r => r.email === email && r.status === 'pending');

    if (!request_obj) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Add to admins with password hash
    const newAdmin = {
      email,
      passwordHash: request_obj.passwordHash,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: getAdminEmail(),
    };

    admins.push(newAdmin);
    await writeDB('admins.json', admins);

    // Update request status
    request_obj.status = 'approved';
    request_obj.approvedAt = new Date().toISOString();
    await writeDB('admin-requests.json', requests);

    // Send approval email to the new admin
    await transporter.sendMail({
      from: senderAddress,
      to: email,
      subject: '✅ Admin Access Approved — Khaana Bank Trust',
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;padding:40px 30px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;">
          <div style="text-align:center;margin-bottom:30px;">
            <h1 style="color:#16a34a;font-size:28px;margin:0;">Access Approved ✅</h1>
          </div>
          <p style="color:#374151;font-size:16px;line-height:1.7;">Dear <strong>${email}</strong>,</p>
          <p style="color:#374151;font-size:16px;line-height:1.7;">
            Your request to join as an Admin of <strong>Khaana Bank Trust</strong> has been <span style="color:#16a34a;font-weight:700;">approved</span> by the primary administrator.
          </p>
          <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:16px 20px;border-radius:8px;margin:24px 0;">
            <p style="margin:0;color:#166534;font-size:15px;"><strong>Email:</strong> ${email}</p>
            <p style="margin:6px 0 0;color:#166534;font-size:15px;"><strong>Password:</strong> The password you set during registration</p>
          </div>
          <div style="text-align:center;margin:30px 0;">
            <a href="${process.env.APP_URL || 'http://localhost:3000'}/admin/login" style="display:inline-block;background:#FF7043;color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-weight:700;font-size:16px;">
              Login to Dashboard →
            </a>
          </div>
          <p style="color:#6b7280;font-size:14px;text-align:center;">If you forgot your password, use the forgot password option on the login page.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;" />
          <p style="color:#9ca3af;font-size:13px;text-align:center;">Khaana Bank Trust • Serving Humanity through Nutrition & Care</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: 'Admin approved successfully!',
      email,
    });
  } catch (err) {
    console.error('Approval error:', err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
