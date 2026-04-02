import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDB, writeDB } from '@/lib/db';
import { getAdminEmail } from '@/lib/adminAuth';

function verifyApprovalToken(token) {
  try {
    if (!token || !token.includes('.')) return null;
    const [encoded, signature] = token.split('.');
    const expected = crypto
      .createHmac('sha256', process.env.ADMIN_SESSION_SECRET || 'change-this-admin-session-secret')
      .update(encoded)
      .digest('base64url');

    if (expected !== signature) return null;

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload?.exp || Date.now() > payload.exp) return null;
    if (payload?.purpose !== 'admin-reset-approval') return null;
    return payload;
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    const payload = verifyApprovalToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired approval link' }, { status: 400 });
    }

    const requests = await readDB('admin-password-reset-requests.json');
    const resetRequest = requests.find(
      (r) => r.id === payload.resetRequestId && r.email === payload.email && r.status === 'pending'
    );

    if (!resetRequest) {
      return NextResponse.json({ error: 'Reset request not found' }, { status: 404 });
    }

    const admins = await readDB('admins.json');

    if (payload.email === getAdminEmail()) {
      resetRequest.status = 'approved';
      resetRequest.approvedAt = new Date().toISOString();
      resetRequest.approvedBy = getAdminEmail();
      resetRequest.primaryAdminNewPasswordHash = resetRequest.passwordHash;
      await writeDB('admin-password-reset-requests.json', requests);

      return NextResponse.json({
        message: 'Primary admin reset approved. Update ADMIN_PASSWORD env variable manually on server.',
      });
    }

    const targetAdmin = admins.find((a) => a.email === payload.email);
    if (!targetAdmin) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 });
    }

    targetAdmin.passwordHash = resetRequest.passwordHash;
    targetAdmin.passwordUpdatedAt = new Date().toISOString();

    resetRequest.status = 'approved';
    resetRequest.approvedAt = new Date().toISOString();
    resetRequest.approvedBy = getAdminEmail();

    await writeDB('admins.json', admins);
    await writeDB('admin-password-reset-requests.json', requests);

    return NextResponse.json({
      message: 'Password reset approved successfully',
      email: payload.email,
    });
  } catch (error) {
    console.error('Password reset approval error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
