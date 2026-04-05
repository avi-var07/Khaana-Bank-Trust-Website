'use client';
import { useState, useEffect } from 'react';

export default function ApprovePage() {
  const [token, setToken] = useState('');
  const [pageStatus, setPageStatus] = useState('loading'); // loading, ready, success, rejected, error
  const [message, setMessage] = useState('Loading request details...');
  const [requestInfo, setRequestInfo] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token') || '';
    setToken(t);

    if (!t) {
      setPageStatus('error');
      setMessage('No approval token provided.');
      return;
    }

    // Fetch request info (GET)
    const fetchInfo = async () => {
      try {
        const res = await fetch(`/api/admin/approve?token=${encodeURIComponent(t)}`);
        const data = await res.json();

        if (res.ok) {
          setRequestInfo(data);
          setPageStatus('ready');
        } else {
          setPageStatus('error');
          setMessage(data.error || 'Unable to load request');
        }
      } catch {
        setPageStatus('error');
        setMessage('Error loading request details');
      }
    };

    fetchInfo();
  }, []);

  const handleApprove = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (res.ok) {
        setPageStatus('success');
        setMessage(data.message || 'Admin approved successfully!');
      } else {
        setPageStatus('error');
        setMessage(data.error || 'Approval failed');
      }
    } catch {
      setPageStatus('error');
      setMessage('Error processing approval');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, reason: rejectionReason }),
      });
      const data = await res.json();

      if (res.ok) {
        setPageStatus('rejected');
        setMessage(data.message || 'Request rejected.');
      } else {
        setPageStatus('error');
        setMessage(data.error || 'Rejection failed');
      }
    } catch {
      setPageStatus('error');
      setMessage('Error processing rejection');
    } finally {
      setProcessing(false);
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    padding: '20px',
  };

  const cardStyle = {
    background: 'white',
    padding: '48px 40px',
    borderRadius: '20px',
    textAlign: 'center',
    maxWidth: '520px',
    width: '100%',
    boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
  };

  const labelStyle = {
    fontSize: '13px',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 600,
    marginBottom: '4px',
  };

  const valueStyle = {
    fontSize: '16px',
    color: '#1f2937',
    fontWeight: 600,
    marginBottom: '16px',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Loading */}
        {pageStatus === 'loading' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <h2 style={{ marginBottom: '10px', color: '#333' }}>Loading...</h2>
            <p style={{ color: '#666' }}>{message}</p>
          </>
        )}

        {/* Ready — Show details + Accept/Reject */}
        {pageStatus === 'ready' && requestInfo && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
            <h2 style={{ marginBottom: '6px', color: '#1f2937', fontSize: '24px' }}>Admin Access Request</h2>
            <p style={{ color: '#6b7280', marginBottom: '28px', fontSize: '15px' }}>
              Review this request and choose to accept or reject.
            </p>

            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', textAlign: 'left', marginBottom: '28px', border: '1px solid #e2e8f0' }}>
              <p style={labelStyle}>Email</p>
              <p style={valueStyle}>{requestInfo.email}</p>
              <p style={labelStyle}>Requested By</p>
              <p style={valueStyle}>{requestInfo.requestedBy}</p>
              <p style={labelStyle}>Requested At</p>
              <p style={{ ...valueStyle, marginBottom: 0 }}>{new Date(requestInfo.createdAt).toLocaleString()}</p>
            </div>

            {/* Rejection reason */}
            <div style={{ marginBottom: '24px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                Rejection Reason <span style={{ color: '#9ca3af', fontWeight: 400 }}>(required if rejecting)</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="E.g., Not a recognized team member, please contact the founder directly..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF7043'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleReject}
                disabled={processing}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: '2px solid #ef4444',
                  background: 'white',
                  color: '#ef4444',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  opacity: processing ? 0.6 : 1,
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {processing ? '...' : '❌ Reject'}
              </button>
              <button
                onClick={handleApprove}
                disabled={processing}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  opacity: processing ? 0.6 : 1,
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 15px rgba(22,163,74,0.3)',
                  fontFamily: 'inherit',
                }}
              >
                {processing ? '...' : '✅ Accept'}
              </button>
            </div>
          </>
        )}

        {/* Approved */}
        {pageStatus === 'success' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ marginBottom: '10px', color: '#16a34a', fontSize: '26px' }}>Admin Approved!</h2>
            <p style={{ color: '#4b5563', marginBottom: '20px', fontSize: '15px', lineHeight: 1.7 }}>{message}</p>
            <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
              <p style={{ margin: 0, color: '#166534', fontSize: '14px' }}>
                An approval email has been sent to the new admin. They can now login at <a href="/admin/login" style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}>/admin/login</a>.
              </p>
            </div>
          </>
        )}

        {/* Rejected */}
        {pageStatus === 'rejected' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🚫</div>
            <h2 style={{ marginBottom: '10px', color: '#dc2626', fontSize: '26px' }}>Request Rejected</h2>
            <p style={{ color: '#4b5563', marginBottom: '20px', fontSize: '15px', lineHeight: 1.7 }}>{message}</p>
            <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '10px' }}>
              <p style={{ margin: 0, color: '#991b1b', fontSize: '14px' }}>
                A rejection email has been sent to the requester.
              </p>
            </div>
          </>
        )}

        {/* Error */}
        {pageStatus === 'error' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ marginBottom: '10px', color: '#ef4444', fontSize: '26px' }}>Error</h2>
            <p style={{ color: '#4b5563', fontSize: '15px' }}>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
