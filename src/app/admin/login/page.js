'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simplified for MVP - using a placeholder password
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials');
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
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Admin Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                style={{ width: '100%', padding: '12px', border: '2px solid #eee', borderRadius: '8px', outline: 'none' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p style={{ color: 'var(--blood)', fontSize: '0.9rem', marginBottom: '20px', fontWeight: '600' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
