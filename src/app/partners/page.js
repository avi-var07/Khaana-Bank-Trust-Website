'use client';
export default function PartnersPage() {
  const partners = [
    { name: "Local Hospital 1", city: "City Name", type: "Medical Partner" },
    { name: "Blood Bank A", city: "City Name", type: "Health Partner" },
    { name: "Corporation X", city: "City Name", type: "CSR Partner" },
    { name: "School Group Y", city: "City Name", type: "Education Partner" },
    { name: "Local NGO Network", city: "City Name", type: "Collaborator" },
    { name: "State Health Dept", city: "City Name", type: "Government Partner" }
  ];

  return (
    <div className="partners-page">
      <section className="page-header">
        <div className="container">
          <h1>Our Partners</h1>
          <p>Collaborating with organizations to scale our impact.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Trusted by Many</h2>
            <p>We work with medical institutions, schools, and corporate bodies to ensure our initiatives reach the right people.</p>
          </div>
          <div className="partners-grid">
            {partners.map((partner, idx) => (
              <div key={idx} className="partner-card glass-card fade-in">
                <div className="partner-logo">LOGO</div>
                <h3>{partner.name}</h3>
                <span className="type">{partner.type}</span>
                <p className="city">{partner.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <div className="cta-box glass-card text-center">
            <h2>Become a Partner</h2>
            <p>Are you an organization looking to make a social impact? Join hands with Khaana Bank Trust.</p>
            <a href="/contact?subject=Partnership Inquiry" className="btn btn-primary">Collaborate With Us</a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          padding: 80px 0;
          background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1521791136064-7986c2959213?q=80&w=2070') center/cover;
          color: white;
          text-align: center;
        }

        .page-header h1 { font-size: 3.5rem; margin-bottom: 10px; }
        .page-header p { font-size: 1.2rem; opacity: 0.9; }

        .section { padding: var(--section-padding); }
        .bg-light { background: var(--surface); }

        .partners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
        }

        .partner-card {
          text-align: center;
          padding: 40px 20px;
          transition: var(--transition);
        }

        .partner-card:hover { transform: translateY(-5px); }

        .partner-logo {
          width: 100px;
          height: 100px;
          background: #f0f0f0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-weight: 900;
          color: #ccc;
        }

        .partner-card h3 { font-size: 1.2rem; margin-bottom: 5px; }
        .type { display: inline-block; padding: 4px 12px; border-radius: 20px; background: rgba(255, 112, 67, 0.1); color: var(--primary); font-size: 0.8rem; font-weight: 700; margin-bottom: 10px; }
        .city { color: var(--text-muted); font-size: 0.9rem; }

        .cta-box { padding: 60px; max-width: 900px; margin: 0 auto; }
        .cta-box h2 { margin-bottom: 20px; }
        .cta-box p { margin-bottom: 30px; font-size: 1.1rem; color: var(--text-muted); }
        .text-center { text-align: center; }

        @media (max-width: 768px) {
          .partners-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
