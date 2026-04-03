'use client';
import { useState } from 'react';
import DeveloperCard from '@/components/DeveloperCard';

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [formMsg, setFormMsg] = useState('');
  const [formErr, setFormErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMsg('');
    setFormErr('');

    const form = e.currentTarget;
    const payload = {
      fullName: form.fullName.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value,
      message: form.message.value.trim(),
    };

    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormErr(data.error || 'Failed to send message.');
        return;
      }

      setFormMsg('Message sent successfully. We will contact you soon.');
      form.reset();
    } catch {
      setFormErr('Unable to send message right now. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="page-header">
        <div className="container">
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you. Let's work together to make a difference.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-info-grid">
            <div className="info-card glass-card">
              <div className="icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <h4>Call/WhatsApp</h4>
              <p><a href="https://wa.me/918840775823">+91 8840775823</a></p>
            </div>
            <div className="info-card glass-card">
              <div className="icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <h4>Email Us</h4>
              <p>khaanabanktrust@gmail.com</p>
            </div>
            <div className="info-card glass-card">
              <div className="icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h4>Visit Us</h4>
              <p>
                H.no 1, Tripathi Bhawan<br />
                Mainatali Mughalsarai<br />
                District-Chandauli<br />
                PIN code - 232101
              </p>
              <button 
                onClick={() => window.open('https://www.google.com/maps?q=H.no+1,+Tripathi+Bhawan,+Mainatali+Mughalsarai,+District-Chandauli,+232101', '_blank')}
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  backgroundColor: 'var(--blood)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                📍 Get Location
              </button>
            </div>
          </div>

          <div className="main-grid">
            <div className="left-content">
              <div className="person-section">
                <h3>Our Founder</h3>
                <div className="person-card glass-card">
                  <div className="person-inner">
                    <div className="founder-photo-wrap">
                      <img
                        src="/images/Ankit%20Bhaiya.png"
                        alt="Mr. Ankit Tripathi"
                        className="founder-photo"
                      />
                    </div>
                    <div className="person-info">
                      <h5>Mr. Ankit Tripathi</h5>
                      <span className="person-role">Founder / Managing Trustee</span>
                      <p>Leading the mission to ensure no one sleeps hungry in our city.</p>
                      <a href="https://wa.me/918840775823" className="whatsapp-btn">
                        Connect on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-container glass-card">
              <h3>Send us a Message</h3>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullName" placeholder="Your Name" required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" placeholder="+91 00000 00000" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" placeholder="example@email.com" required />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select name="subject" required>
                    <option value="">Choose an option</option>
                    <option value="donation">Donation Support</option>
                    <option value="internship">Join as Intern</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="bug">Report a Bug 🐞</option>
                    <option value="other">General Inquiry</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Your Message</label>
                  <textarea name="message" rows="5" placeholder="How can we help you?" required></textarea>
                </div>
                {formErr && <p style={{ color: 'var(--blood)', marginBottom: '12px' }}>{formErr}</p>}
                {formMsg && <p style={{ color: '#15803d', marginBottom: '12px' }}>{formMsg}</p>}
                <button type="submit" className="btn btn-primary" disabled={sending}>{sending ? 'Sending...' : 'Send Message'}</button>
              </form>
            </div>
          </div>

          <div className="developers-section">
            <h3>Website Developers</h3>
            <div className="dev-grid-new">
              <DeveloperCard
                name="Aviral Ved Prakash Varshney"
                designation="Lead Full Stack Developer"
                description="Aviral Ved Prakash Varshney is a Full Stack Developer specializing in Java and React, focused on building scalable web applications and real-world software solutions. Passionate about problem-solving, backend development, and creating technology that makes a meaningful impact."
                email="aviralvarshney07@gmail.com"
                github="https://github.com/avi-var07"
                linkedin="https://www.linkedin.com/in/avi7/"
                photoPath="/images/Aviral.png"
                photoPosition="center 12%"
              />
              <DeveloperCard
                name="Prashant Kumar Jha"
                designation="QA Engineer"
                description="Prashant Kumar Jha is a dedicated developer who focuses on building practical and user-friendly web applications. He works on both frontend and backend development, creating scalable and efficient systems. He is passionate about problem-solving, learning new technologies, and developing software that solves real-world problems."
                email="jhaprashant9354@gmail.com"
                github="https://github.com/prashantjha03"
                linkedin="https://www.linkedin.com/in/prashantjha03/"
                photoPath="/images/Jhaaan.png"
                photoPosition="center 12%"
              />
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          padding: 120px 0 80px;
          background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074') center/cover;
          color: white;
          text-align: center;
          clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
        }

        .page-header h1 { font-size: 4rem; margin-bottom: 15px; }
        .page-header p { font-size: 1.25rem; opacity: 0.9; max-width: 600px; margin: 0 auto; }

        .section { padding: 80px 0; }

        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-bottom: 80px;
        }

        .info-card {
          text-align: center;
          padding: 40px 30px;
          transition: var(--transition);
          border-bottom: 4px solid transparent;
        }

        .info-card:hover {
          transform: translateY(-10px);
          border-color: var(--primary);
        }

        .icon-box {
          width: 60px;
          height: 60px;
          background: rgba(255, 112, 67, 0.1);
          color: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .icon-box svg { width: 30px; height: 30px; }
        .info-card h4 { font-size: 1.4rem; margin-bottom: 10px; }
        .info-card p { color: var(--text-muted); font-size: 1.1rem; }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 60px;
          align-items: start;
          margin-bottom: 64px;
        }

        .person-section h3 { margin-bottom: 25px; font-size: 1.8rem; }
        
        .person-card {
          padding: 30px;
          border-left: 5px solid var(--primary);
        }

        .person-inner {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .founder-photo-wrap {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          overflow: hidden;
          border: 5px solid rgba(255, 112, 67, 0.2);
          flex-shrink: 0;
          background: #fff;
        }

        .founder-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 24%;
        }

        .person-info h5 { font-size: 1.4rem; margin-bottom: 5px; }
        .person-role { 
          display: inline-block;
          font-size: 0.85rem;
          text-transform: uppercase;
          color: var(--primary);
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 15px;
        }
        
        .whatsapp-btn {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background: #25D366;
          color: white;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.9rem;
          transition: var(--transition);
        }

        .whatsapp-btn:hover {
          background: #128C7E;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
        }

        .developers-section h3 {
          margin-bottom: 25px;
          font-size: 1.8rem;
        }

        .dev-grid-new {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
        }

        .contact-form-container {
          padding: 50px;
          background: white;
          box-shadow: var(--shadow-lg);
        }

        .contact-form-container h3 { font-size: 2rem; margin-bottom: 35px; }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group { margin-bottom: 25px; }
        .form-group label { display: block; margin-bottom: 10px; font-weight: 700; font-size: 0.95rem; }
        
        .form-group input, 
        .form-group select, 
        .form-group textarea {
          width: 100%;
          padding: 15px;
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          outline: none;
          font-family: inherit;
          font-size: 1rem;
          transition: var(--transition);
          background: #fafafa;
        }

        .form-group input:focus, 
        .form-group select:focus, 
        .form-group textarea:focus {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 4px rgba(255, 112, 67, 0.1);
        }

        .submit-btn { width: 100%; padding: 18px; font-size: 1.1rem; }

        @media (max-width: 1100px) {
          .contact-info-grid { grid-template-columns: 1fr 1fr; }
          .main-grid { grid-template-columns: 1fr; gap: 50px; }
          .dev-grid-new { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .page-header h1 { font-size: 3rem; }
          .contact-info-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
          .contact-form-container { padding: 30px 20px; }
          .dev-grid-new { gap: 24px; }
          .person-inner {
            flex-direction: column;
            align-items: flex-start;
          }

          .founder-photo-wrap {
            width: 110px;
            height: 110px;
          }
        }
      `}</style>
    </div>
  );
}
