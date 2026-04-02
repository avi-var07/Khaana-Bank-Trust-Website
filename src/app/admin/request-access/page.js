'use client';

import { useEffect, useState } from 'react';
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
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpCooldownSec, setOtpCooldownSec] = useState(0);
  const [otpBlockSec, setOtpBlockSec] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (otpCooldownSec <= 0 && otpBlockSec <= 0) return;

    const timer = setInterval(() => {
      setOtpCooldownSec((prev) => (prev > 0 ? prev - 1 : 0));
      setOtpBlockSec((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [otpCooldownSec, otpBlockSec]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m <= 0) return `${s}s`;
    return `${m}m ${s}s`;
  };

  const otpButtonLabel = otpVerified
    ? 'Verified'
    : otpBlockSec > 0
      ? `Try after ${formatTime(otpBlockSec)}`
      : otpCooldownSec > 0
        ? 'Sent'
        : otpSent
          ? 'Resend OTP'
          : 'Send OTP';

  const sendOtp = async () => {
    setError('');
    setMessage('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email first.');
      return;
    }

    setOtpBusy(true);
    try {
      const res = await fetch('/api/admin/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data?.retryAfterSec) {
          setOtpBlockSec(data.retryAfterSec);
        }
        setError(data.error || 'Failed to send OTP');
        return;
      }

      setOtpSent(true);
      setOtpCooldownSec(60);
      setMessage('OTP sent to your email.');
    } catch {
      setError('Unable to send OTP right now.');
    } finally {
      setOtpBusy(false);
    }
  };

  const verifyOtp = async () => {
    setError('');
    setMessage('');

    if (!otp || otp.length < 4) {
      setError('Please enter the OTP from your email.');
      return;
    }

    setOtpBusy(true);
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
      setOtpBusy(false);
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
      alert('Request sent. You will be notified via mail on confirmation through khaanabanktrust@gmail.com');
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
                disabled={otpBusy}
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
                disabled={!otpSent || otpVerified || otpBusy}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={sendOtp}
                disabled={loading || otpBusy || otpVerified || otpCooldownSec > 0 || otpBlockSec > 0}
              >
                {otpButtonLabel}
              </button>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={verifyOtp}
              disabled={loading || otpBusy || !otpSent || otpVerified}
              style={{ width: '100%', marginBottom: '16px' }}
            >
              {otpVerified ? 'Verified' : 'Verify OTP'}
            </button>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={otpBusy}
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
                disabled={otpBusy}
                style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px' }}
              />
            </div>

            {error && <p style={{ color: 'var(--blood)', marginBottom: '12px' }}>{error}</p>}
            {message && <p style={{ color: '#15803d', marginBottom: '12px' }}>{message}</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading || otpBusy || !otpVerified}>
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
