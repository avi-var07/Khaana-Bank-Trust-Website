'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
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
      setError('Please enter a valid admin email first.');
      return;
    }

    setOtpBusy(true);
    try {
      const res = await fetch('/api/admin/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'admin-reset' }),
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

    if (!otp) {
      setError('Enter OTP first.');
      return;
    }

    setOtpBusy(true);
    try {
      const res = await fetch('/api/admin/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, purpose: 'admin-reset' }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'OTP verification failed');
        return;
      }

      setOtpVerified(true);
      setVerificationToken(data.verificationToken);
      setMessage('OTP verified. You can now request password reset approval.');
    } catch {
      setError('Unable to verify OTP right now.');
    } finally {
      setOtpBusy(false);
    }
  };

  const requestReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otpVerified || !verificationToken) {
      setError('Verify OTP before requesting password reset.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, verificationToken }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit reset request');
        return;
      }

      setMessage('Reset request sent to khaanabanktrust@gmail.com for approval.');
      setNewPassword('');
      setConfirmPassword('');
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
          <h2 style={{ textAlign: 'center' }}>Admin Forgot Password</h2>
          <p style={{ textAlign: 'center', marginBottom: '25px', color: 'var(--text-muted)' }}>
            Verify email via OTP, then send reset request for primary-admin approval.
          </p>

          <form onSubmit={requestReset}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Admin Email</label>
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
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={otpBusy}
                style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Retype New Password</label>
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
              {loading ? 'Submitting...' : 'Send Reset Request'}
            </button>
          </form>

          <p style={{ marginTop: '14px', textAlign: 'center' }}>
            Back to <Link href="/admin/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Admin Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
