'use client';
import Link from "next/link";

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content fade-in">
            <span className="badge">Welcome to Khaana Bank Trust</span>
            <h1>Feeding the Hungry, Educating the Children, <br /><span className="text-gradient">Nurturing the Nature.</span></h1>
            <p>
              Khaana Bank Trust is a non-profit organization dedicated to serving society by addressing hunger, 
              education, health, and environmental sustainability. Established in 2018, we work at the grassroots 
              level to create meaningful social impact.
            </p>
            <div className="hero-btns">
              <Link href="/support" className="btn btn-primary">Donate Now</Link>
              <Link href="/about" className="btn btn-secondary">Our Story</Link>
            </div>
          </div>
        </div>
        <div className="hero-bg-accent"></div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>500+</h3>
              <p>Daily Meals</p>
            </div>
            <div className="stat-card">
              <h3>50+</h3>
              <p>Blood Camps</p>
            </div>
            <div className="stat-card">
              <h3>1000+</h3>
              <p>Trees Planted</p>
            </div>
            <div className="stat-card">
              <h3>200+</h3>
              <p>Students Supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick About Section */}
      <section className="quick-about">
        <div className="container">
          <div className="about-flex">
            <div className="about-text">
              <div className="section-title" style={{ textAlign: 'left' }}>
                <h2>Small efforts, when done together, create a big difference.</h2>
              </div>
              <p>
                Khaana Bank Trust is a non-profit organization registered under The Indian Trust Act, 1882, working in the field of social welfare since August 3, 2018. 
                We primarily work at the grassroots level, focusing on helping underprivileged communities through food distribution, 
                education support, health initiatives, and environmental activities.
              </p>
              <ul className="check-list">
                <li>Providing nutritious meals to daily wage workers and families in need</li>
                <li>"Learn Through Fun" program for rural government school children</li>
                <li>Reducing food waste through surplus food redistribution</li>
                <li>Regular Blood Donation Camps and health awareness</li>
                <li>Environmental sustainability through plantation drives</li>
              </ul>
              <Link href="/about" className="btn btn-secondary" style={{ marginTop: '30px' }}>Learn More About Us</Link>
            </div>
            <div className="about-image">
               <div className="image-placeholder glass-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p>Inspirational Image Placeholder</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero {
          padding: 120px 0 80px;
          position: relative;
          overflow: hidden;
          background: var(--surface);
        }

        .hero-content {
          max-width: 800px;
          position: relative;
          z-index: 2;
        }

        .badge {
          display: inline-block;
          padding: 6px 16px;
          background: rgba(255, 112, 67, 0.1);
          color: var(--primary);
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.85rem;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        h1 {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 25px;
          color: var(--text-main);
        }

        .text-gradient {
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        p {
          font-size: 1.2rem;
          color: var(--text-muted);
          margin-bottom: 40px;
          max-width: 600px;
        }

        .hero-btns {
          display: flex;
          gap: 20px;
        }

        .hero-bg-accent {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 60%;
          height: 140%;
          background: radial-gradient(circle, rgba(255, 112, 67, 0.05) 0%, transparent 70%);
          z-index: 1;
          pointer-events: none;
        }

        .stats-section {
          padding: 60px 0;
          background: var(--white);
          border-bottom: 1px solid #eee;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          text-align: center;
        }

        .stat-card h3 {
          font-size: 2.5rem;
          color: var(--primary);
          margin-bottom: 5px;
        }

        .stat-card p {
          font-size: 1rem;
          color: var(--text-muted);
          margin-bottom: 0;
        }

        .quick-about {
          padding: var(--section-padding);
        }

        .about-flex {
          display: flex;
          align-items: center;
          gap: 80px;
        }

        .about-text {
          flex: 1;
        }

        .about-image {
          flex: 1;
        }

        .check-list {
          margin-top: 30px;
        }

        .check-list li {
          margin-bottom: 15px;
          padding-left: 30px;
          position: relative;
          font-weight: 500;
        }

        .check-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--accent);
          font-weight: 900;
        }

        @media (max-width: 992px) {
          h1 { font-size: 3rem; }
          .about-flex { flex-direction: column; gap: 50px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .hero { padding: 80px 0 60px; }
          h1 { font-size: 2.5rem; }
          .hero-btns { flex-direction: column; }
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
