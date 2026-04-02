'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('khaanabanktrust@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
        return;
      }

      const payload = await res.json().catch(() => ({}));
      setError(payload.error || 'Invalid credentials');
    } catch {
      setError('Unable to login right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="login-card glass-card fade-in" style={{ width: '100%', maxWidth: '400px', padding: '40px', textAlign: 'center' }}>
          <h2>Admin Login</h2>
          <p style={{ marginBottom: '30px', color: 'var(--text-muted)' }}>Secure access for Khaana Bank Trust team.</p>
          
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Admin Email</label>
              <input
                type="email"
                placeholder="admin@domain.com"
                style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px', outline: 'none' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Admin Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px', outline: 'none' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: 'var(--blood)', fontSize: '0.9rem', marginBottom: '20px', fontWeight: '600' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
            <p style={{ marginTop: '14px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <Link href="/admin/forgot-password" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Forgot password? Request reset approval
              </Link>
            </p>
            <p style={{ marginTop: '10px', fontSize: '0.95rem' }}>
              <Link href="/admin/request-access" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Request to Join As Admin
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
