'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RequestAdminAccessPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sendOtp = async () => {
    setError('');
    setMessage('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email first.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send OTP');
        return;
      }

      setOtpSent(true);
      setMessage('OTP sent to your email.');
    } catch {
      setError('Unable to send OTP right now.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError('');
    setMessage('');

    if (!otp || otp.length < 4) {
      setError('Please enter the OTP from your email.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'OTP verification failed');
        return;
      }

      setOtpVerified(true);
      setVerificationToken(data.verificationToken);
      setMessage('Email verified successfully. You can now submit request.');
    } catch {
      setError('Unable to verify OTP right now.');
    } finally {
      setLoading(false);
    }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otpVerified || !verificationToken) {
      setError('Please verify your email with OTP first.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          requestedBy: email,
          verificationToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Request submission failed');
        return;
      }

      setMessage('Request submitted. Approval email has been sent to khaanabanktrust@gmail.com.');
      setPassword('');
      setConfirmPassword('');
      setOtp('');
    } catch {
      setError('Unable to submit request right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh' }}>
        <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
          <h2 style={{ textAlign: 'center' }}>Request to Join As Admin</h2>
          <p style={{ textAlign: 'center', marginBottom: '25px', color: 'var(--text-muted)' }}>
            Verify your email via OTP and send approval request.
          </p>

          <form onSubmit={submitRequest}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                style={{ flex: 1, padding: '12px', border: '2px solid #eee', borderRadius: '8px' }}
                disabled={!otpSent || otpVerified}
              />
              <button type="button" className="btn btn-secondary" onClick={sendOtp} disabled={loading || otpVerified}>
                {otpSent ? 'Resend OTP' : 'Send OTP'}
              </button>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={verifyOtp}
              disabled={loading || !otpSent || otpVerified}
              style={{ width: '100%', marginBottom: '16px' }}
            >
              {otpVerified ? 'Email Verified' : 'Verify OTP'}
            </button>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Retype Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px' }}
              />
            </div>

            {error && <p style={{ color: 'var(--blood)', marginBottom: '12px' }}>{error}</p>}
            {message && <p style={{ color: '#15803d', marginBottom: '12px' }}>{message}</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading || !otpVerified}>
              {loading ? 'Submitting...' : 'Send Admin Join Request'}
            </button>
          </form>

          <p style={{ marginTop: '14px', textAlign: 'center' }}>
            Already an admin? <Link href="/admin/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
