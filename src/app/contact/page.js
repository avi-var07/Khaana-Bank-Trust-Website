'use client';
export default function ContactPage() {
  return (
    <div className="contact-page">
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with the team behind Khaana Bank Trust.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div className="contact-info">
              <div className="info-section">
                <h3>Our Founders</h3>
                <div className="contact-card glass-card">
                  <p><strong>Mr. Ankit Tripathi</strong></p>
                  <p className="founder-contact">
                    <a href="https://wa.me/918840775823" style={{color: '#25D366', fontWeight: 'bold'}}>
                      📞/💬 +91 8840775823 (WhatsApp)
                    </a>
                  </p>
                </div>
              </div>

              <div className="info-section" style={{ marginTop: '40px' }}>
                <h3>Website Developers</h3>
                <div className="contact-card glass-card">
                  <p><strong>Dev Team</strong></p>
                  <p>📧 dev@ngo-support.com</p>
                  <p>🌐 portfolio-link.com</p>
                </div>
              </div>

              <div className="social-cta" style={{ marginTop: '60px' }}>
                 <h3>Report an Issue</h3>
                 <p>Found a bug on the website? Please let us know using the "Report a Bug" option in the form.</p>
              </div>
            </div>

            <div className="contact-form-container glass-card fade-in">
              <h3>Get In Touch</h3>
              <form className="contact-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="email@example.com" required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+91 XXXXXXXXXX" required />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select required>
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="donation">Donation Support</option>
                    <option value="internship">Join as Intern</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="bug">Report a Bug 🐞</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea rows="5" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          padding: 80px 0;
          background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?q=80&w=2020') center/cover;
          color: white;
          text-align: center;
        }

        .page-header h1 { font-size: 3.5rem; margin-bottom: 10px; }
        .page-header p { font-size: 1.2rem; opacity: 0.9; }

        .section { padding: var(--section-padding); }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }

        .contact-card { padding: 25px; margin-top: 15px; }
        .contact-card p { margin-bottom: 8px; font-size: 1.1rem; }

        .contact-form-container { padding: 40px; border-top: 5px solid var(--primary); }
        .contact-form-container h3 { margin-bottom: 30px; font-size: 1.6rem; }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; }
        
        .form-group input, 
        .form-group select, 
        .form-group textarea {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #eee;
          border-radius: 8px;
          outline: none;
          font-family: inherit;
          transition: var(--transition);
        }

        .form-group input:focus, 
        .form-group select:focus, 
        .form-group textarea:focus {
          border-color: var(--primary);
        }

        @media (max-width: 992px) {
          .grid-2 { grid-template-columns: 1fr; gap: 60px; }
          .contact-form-container { padding: 30px 20px; }
        }
      `}</style>
    </div>
  );
}
