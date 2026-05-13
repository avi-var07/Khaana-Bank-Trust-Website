'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminSetupPage() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Validating invite link...');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incomingToken = params.get('token') || '';
    setToken(incomingToken);

    if (!incomingToken) {
      setStatus('error');
      setMessage('Missing invite token.');
      return;
    }

    const verifyInvite = async () => {
      try {
        const res = await fetch(`/api/admin/invite?token=${encodeURIComponent(incomingToken)}`);
        const data = await res.json();

        if (!res.ok) {
          setStatus('error');
          setMessage(data.error || 'Invalid invite link.');
          return;
        }

        setEmail(data.email);
        setStatus('ready');
      } catch {
        setStatus('error');
        setMessage('Unable to verify invite link right now.');
      }
    };

    verifyInvite();
  }, []);

  const submitSetup = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setBusy(true);
    setStatus('ready');
    setMessage('');

    try {
      const res = await fetch('/api/admin/invite', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Failed to complete setup.');
        return;
      }

      setStatus('success');
      setMessage('Your admin account is ready. You can now log in.');
    } catch {
      setStatus('error');
      setMessage('Unable to complete setup right now.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh' }}>
        <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '520px', padding: '40px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Admin Setup</h2>
          <p style={{ textAlign: 'center', marginBottom: '26px', color: 'var(--text-muted)' }}>
            Complete your invite to create your admin account.
          </p>

          {status === 'loading' && <p style={{ textAlign: 'center' }}>{message}</p>}

          {status === 'ready' && (
            <form onSubmit={submitSetup}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Invited Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Set Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
                {busy ? 'Creating account...' : 'Create Admin Account'}
              </button>
            </form>
          )}

          {status === 'success' && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#166534', marginBottom: '12px' }}>{message}</p>
              <Link href="/admin/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Go to Admin Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--blood)', marginBottom: '12px' }}>{message}</p>
              <Link href="/admin/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Back to Admin Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
