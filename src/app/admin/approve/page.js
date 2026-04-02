'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ApprovePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Processing approval...');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No approval token provided');
      return;
    }

    const approveAdmin = async () => {
      try {
        const res = await fetch(`/api/admin/approve?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setEmail(data.email);
          setMessage('Admin has been approved successfully! They can now login.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Approval failed');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Error processing approval');
      }
    };

    approveAdmin();
  }, [token]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ background: 'white', padding: '60px', borderRadius: '12px', textAlign: 'center', maxWidth: '500px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        {status === 'loading' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <h2 style={{ marginBottom: '10px', color: '#333' }}>Processing...</h2>
            <p style={{ color: '#666' }}>{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ marginBottom: '10px', color: '#10b981' }}>Success!</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>{message}</p>
            <p style={{ background: '#f3f4f6', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
              Email: <strong>{email}</strong>
            </p>
            <p style={{ color: '#999', fontSize: '14px' }}>The new admin can now login at <a href="/admin/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>/admin/login</a></p>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
            <h2 style={{ marginBottom: '10px', color: '#ef4444' }}>Error</h2>
            <p style={{ color: '#666' }}>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
