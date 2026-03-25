'use client';
import { useState } from 'react';
import styles from './SubscribeModal.module.css';

const SubscribeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setFormData({ name: '', email: '', phone: '' });
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className={styles.overlay} onClick={() => status !== 'loading' && onClose()}>
      <div className={`${styles.modal} glass-card fade-in`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        {status === 'success' ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>🎉</div>
            <h3>Thank You for Subscribing!</h3>
            <p>You'll now receive updates about our upcoming events and initiatives.</p>
          </div>
        ) : (
          <>
            <h2>Subscribe to Updates</h2>
            <p>Get notified about events, donation drives, and impact reports directly via Email and WhatsApp.</p>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Phone Number (for WhatsApp)</label>
                <input 
                  type="tel" 
                  placeholder="+91 XXXXXXXXXX" 
                  required 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={status === 'loading'}
                style={{ width: '100%', marginTop: '10px' }}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
              </button>
              {status === 'error' && <p className={styles.error}>Something went wrong. Please try again.</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscribeModal;
