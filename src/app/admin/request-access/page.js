'use client';

import Link from 'next/link';

export default function RequestAdminAccessPage() {
  return (
    <div className="login-page">
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '520px', padding: '40px', textAlign: 'center' }}>
          <h2>Admin Access</h2>
          <p style={{ marginBottom: '14px', color: 'var(--text-muted)' }}>
            Public admin access requests are disabled for security reasons.
          </p>
          <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
            New admin accounts can be created only through invite links sent by the primary admin.
          </p>
          <Link href="/admin/login" className="btn btn-primary" style={{ display: 'inline-block' }}>
            Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
