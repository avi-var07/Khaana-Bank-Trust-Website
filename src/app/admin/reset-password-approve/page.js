'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ResetPasswordApprovePage() {
  const [token, setToken] = useState('');

  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Approving password reset request...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token') || '');
  }, []);

  useEffect(() => {
    if (!token) {
      if (typeof window !== 'undefined') {
        const hasQuery = window.location.search.includes('token=');
        if (!hasQuery) {
          setStatus('error');
          setMessage('Missing approval token.');
        }
      }
      return;
    }

    const approve = async () => {
      try {
        const res = await fetch(`/api/admin/password-reset/approve?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          setStatus('error');
          setMessage(data.error || 'Approval failed');
          return;
        }

        setStatus('success');
        setMessage(data.message || 'Password reset approved.');
      } catch {
        setStatus('error');
        setMessage('Unable to complete approval right now.');
      }
    };

    approve();
  }, [token]);

  return (
    <div className="login-page">
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '520px', padding: '40px', textAlign: 'center' }}>
          <h2>{status === 'success' ? 'Approved' : status === 'error' ? 'Error' : 'Processing'}</h2>
          <p style={{ marginTop: 10 }}>{message}</p>
          <p style={{ marginTop: 16 }}>
            <Link href="/admin/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Go to Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
