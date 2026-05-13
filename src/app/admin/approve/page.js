'use client';

import Link from 'next/link';

export default function ApprovePage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '40px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '10px' }}>Legacy Approval Flow Disabled</h2>
        <p style={{ marginBottom: '14px', color: 'var(--text-muted)' }}>
          Public request approval links are no longer active.
        </p>
        <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
          Admin onboarding is now invite-only from the primary admin dashboard.
        </p>
        <Link href="/admin/login" className="btn btn-primary" style={{ display: 'inline-block' }}>
          Back to Admin Login
        </Link>
      </div>
    </div>
  );
}
