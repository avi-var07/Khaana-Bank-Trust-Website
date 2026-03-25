'use client';
export default function ConnectPage() {
  const socialLinks = [
    { name: "Instagram", icon: "📸", handle: "@Khaanabank", link: "https://instagram.com" },
    { name: "Facebook", icon: "👥", handle: "Khaana Bank Trust", link: "https://facebook.com" },
    { name: "YouTube", icon: "🎥", handle: "Khaana Bank TV", link: "https://youtube.com" },
    { name: "Twitter", icon: "🐦", handle: "@Khaanabank", link: "https://twitter.com" },
    { name: "LinkedIn", icon: "💼", handle: "Khaana Bank Trust", link: "https://linkedin.com" }
  ];

  return (
    <div className="connect-page">
      <section className="page-header">
        <div className="container">
          <h1>Connect With Us</h1>
          <p>Join our online community and stay updated.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="connect-grid">
            {/* Social Links */}
            <div className="social-section">
              <div className="section-title" style={{ textAlign: 'left' }}>
                <h2>Follow Our Journey</h2>
              </div>
              <div className="social-cards">
                {socialLinks.map((social, idx) => (
                  <a key={idx} href={social.link} target="_blank" rel="noopener noreferrer" className="social-item glass-card fade-in">
                    <span className="icon">{social.icon}</span>
                    <div className="info">
                      <h4>{social.name}</h4>
                      <p>{social.handle}</p>
                    </div>
                    <span className="arrow">→</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Direct Connect */}
            <div className="direct-section">
              <div className="direct-box glass-card whatsapp fade-in">
                <div className="icon">💬</div>
                <h3>Chat on WhatsApp</h3>
                <p>Connect directly with Ankit Tripathi Ji for immediate queries or coordination.</p>
                <a href="https://wa.me/91XXXXXXXXXX" className="btn btn-secondary">WhatsApp Ankit Ji</a>
              </div>

              <div className="direct-box glass-card gmail fade-in" style={{ marginTop: '30px' }}>
                <div className="icon">✉️</div>
                <h3>Send an Email</h3>
                <p>Prefer email? Send us a direct message to our official mailbox.</p>
                <a href="mailto:info@Khaanabank.org" className="btn btn-secondary">Open Gmail</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          padding: 80px 0;
          background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1516251193007-45ef944abb81?q=80&w=2070') center/cover;
          color: white;
          text-align: center;
        }

        .page-header h1 { font-size: 3.5rem; margin-bottom: 10px; }
        .page-header p { font-size: 1.2rem; opacity: 0.9; }

        .section { padding: var(--section-padding); }

        .connect-grid { display: grid; grid-template-columns: 1fr 400px; gap: 80px; }

        .social-cards { display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 30px; }
        
        .social-item {
          display: flex;
          align-items: center;
          padding: 20px 30px;
          gap: 20px;
          transition: var(--transition);
        }

        .social-item:hover { transform: translateX(10px); background: rgba(255, 112, 67, 0.05); border-color: var(--primary); }
        
        .social-item .icon { font-size: 2rem; }
        .social-item .info h4 { font-size: 1.2rem; }
        .social-item .info p { color: var(--text-muted); font-size: 0.9rem; }
        .social-item .arrow { margin-left: auto; font-size: 1.5rem; opacity: 0; transition: var(--transition); color: var(--primary); }
        .social-item:hover .arrow { opacity: 1; }

        .direct-box { padding: 40px; text-align: center; }
        .direct-box .icon { font-size: 3rem; margin-bottom: 20px; }
        .direct-box h3 { margin-bottom: 15px; }
        .direct-box p { margin-bottom: 25px; color: var(--text-muted); }
        
        .whatsapp { border-top: 5px solid #25D366; }
        .gmail { border-top: 5px solid #D14836; }

        @media (max-width: 992px) {
          .connect-grid { grid-template-columns: 1fr; gap: 60px; }
        }
      `}</style>
    </div>
  );
}
