'use client';
export default function AboutPage() {
  return (
    <div className="about-page">

      {/* About Us Description */}
      <section className="about-hero-section section">
        {/* Background Decorative Elements */}
        <div className="bg-decor-blob blob-1"></div>
        <div className="bg-decor-blob blob-2"></div>
        
        <div className="container hero-content-wrapper">
          <div className="section-title fade-in">
            <h2 className="hero-title">About Khaana Bank Trust</h2>
            <p className="hero-subtitle">A mission to serve humanity, one step at a time.</p>
          </div>
          
          <div className="hero-paragraphs">
            <div className="hero-para-block fade-in-up">
              <div className="para-accent"></div>
              <p>
                <strong>Khaana Bank Trust</strong> is a non-profit organization registered under The Indian Trust Act, 1882, 
                working in the field of <strong>social welfare</strong> since August 3, 2018. The Trust was founded 
                with the vision of creating a society where <strong>no one sleeps hungry</strong>, every child gets 
                education, and people live in a clean and green environment.
              </p>
            </div>

            <div className="hero-para-block fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="para-accent"></div>
              <p>
                Khaana Bank Trust primarily works at the <strong>grassroots level</strong>, focusing on helping 
                underprivileged communities through food distribution, education support, and health initiatives. 
                We provide <strong>nutritious meals</strong> to daily wage workers, rickshaw pullers, and needy families, 
                while managing <strong>surplus food</strong> to reduce waste effectively.
              </p>
            </div>

            <div className="hero-para-block fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="para-accent"></div>
              <p>
                We believe that education is the <strong>most powerful tool</strong> to break the cycle of poverty. 
                Our <strong>“Learn Through Fun”</strong> program brings interactive learning, games, and 
                creative activities to primary government school children in rural areas, making education 
                both <strong>engaging and impactful</strong>.
              </p>
            </div>

            <div className="hero-para-block fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="para-accent"></div>
              <p>
                Our impact extends to <strong>blood donation camps</strong>, tree plantation drives, and health 
                awareness activities for the youth. We are committed to supporting <strong>orphanages and shelter homes</strong>, 
                as well as providing <strong>medicine support</strong> to those in urgent need.
              </p>
            </div>

            <div className="hero-para-block fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="para-accent"></div>
              <p>
                Khaana Bank Trust believes that <strong>real change</strong> is possible when society comes together. 
                With the support of our volunteers and donors, we continue to work towards building a 
                <strong> better, more compassionate, and sustainable society</strong> for everyone.
              </p>
            </div>
          </div>
          
          <div className="quote-section fade-in" style={{ animationDelay: '1.2s' }}>
             <p className="final-quote">“Small efforts, when done together, create a big difference.”</p>
             <div className="quote-accent"></div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div className="content">
              <div className="section-title" style={{ textAlign: 'left' }}>
                <h2>Our Mission</h2>
              </div>
              <p>
                To work towards a hunger-free, educated, healthy, and environmentally aware society by 
                providing support to underprivileged communities and creating awareness about social responsibility.
              </p>
              <ul className="mission-list">
                <li>Provide regular nutritious meals to reduce hunger and malnutrition.</li>
                <li>Improve access to education through the “Learn Through Fun” initiative.</li>
                <li>Organize blood donation camps and health-related activities.</li>
                <li>Promote environmental sustainability through plantation drives.</li>
                <li>Encourage youth participation in sports, yoga, and fitness.</li>
                <li>Support shelter homes, orphan homes, and provide medical help.</li>
                <li>Reduce food waste by redistribution of surplus food.</li>
                <li>Encourage volunteerism and community participation.</li>
              </ul>
            </div>
            <div className="content">
              <div className="section-title" style={{ textAlign: 'left' }}>
                <h2>Our Vision</h2>
              </div>
              <p>
                To build a community where people help each other and work together to create 
                a better, more compassionate, and responsible society for everyone.
              </p>
              <ul className="vision-list">
                <li>Every person has access to food, education, and healthcare.</li>
                <li>Zero food waste through proper management and distribution.</li>
                <li>Equal opportunities for children from underprivileged backgrounds.</li>
                <li>Active social responsibility and community participation.</li>
                <li>A clean and green environment protected for future generations.</li>
                <li>Physically and mentally healthy youth through sports and yoga.</li>
                <li>Growth with compassion, equality, and sustainability.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-title">
            <h2>Our Core Values</h2>
            <p>The principles that guide every action we take.</p>
          </div>
          <div className="grid-3">
            <div className="value-card glass-card">
              <div className="icon">🤝</div>
              <h3>Empathy</h3>
              <p>Understanding the pain of others and acting with a kind heart to alleviate it.</p>
            </div>
            <div className="value-card glass-card">
              <div className="icon">⚖️</div>
              <h3>Integrity</h3>
              <p>Maintaining absolute transparency in our distribution and donation processes.</p>
            </div>
            <div className="value-card glass-card">
              <div className="icon">🌱</div>
              <h3>Sustainability</h3>
              <p>Ensuring our actions today create a better and greener environment for tomorrow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section bg-light">
        <div className="container">
          <div className="grid-2">
            <div className="image-box glass-card">
              <img 
                src="/images/Ankit Bhaiya.png" 
                alt="Founder Mr. Ankit Tripathi" 
                style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070';
                }}
              />
              <p className="image-caption">Founder: Mr. Ankit Tripathi</p>
            </div>
            <div className="content">
              <div className="section-title" style={{ textAlign: 'left' }}>
                <h2>Our Story</h2>
              </div>
              <p>
                Khaana Bank Trust began with a simple act of kindness that later turned into a mission to serve society.
              </p>
              <p>
                The founder, <strong>Mr. Ankit Tripathi</strong>, once saw a small child outside his house searching through garbage. 
                The child was picking out used mango seeds (ghootliyan), washing them, and eating them to satisfy his hunger. 
                This heartbreaking scene deeply affected him. He immediately brought fresh mangoes and gave them to the child and 
                also provided ration for his family so they could have proper meals.
              </p>
              <p>
                From that day, a simple thought came to his mind: <br />
                <em>“Why not cook two extra chapatis every day for someone who is hungry?”</em>
              </p>
              <p>
                This small idea became the beginning of a big mission. What started with feeding one child soon became helping many people. 
                Today, Khaana Bank Trust continues with a mission to serve humanity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          padding: 80px 0;
          background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070') center/cover;
          color: white;
          text-align: center;
        }

        .page-header h1 { font-size: 3.5rem; margin-bottom: 10px; }
        .page-header p { font-size: 1.2rem; opacity: 0.9; }

        .section { padding: var(--section-padding); }
        .bg-light { background: var(--surface); }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }

        .image-caption { text-align: center; margin-top: 10px; font-weight: 600; color: var(--text-muted); }

        .about-hero-section {
          position: relative;
          overflow: hidden;
          background: var(--surface);
          padding: 120px 20px;
        }

        .bg-decor-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
          opacity: 0.15;
          animation: float 20s infinite alternate;
        }

        .blob-1 {
          width: 500px;
          height: 500px;
          background: var(--primary);
          top: -100px;
          right: -100px;
        }

        .blob-2 {
          width: 400px;
          height: 400px;
          background: var(--secondary);
          bottom: -100px;
          left: -100px;
          animation-delay: -5s;
        }

        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 100px) scale(1.1); }
        }

        .hero-content-wrapper {
          position: relative;
          z-index: 1;
          max-width: 900px;
        }

        .hero-title {
          font-size: 3.5rem;
          background: linear-gradient(135deg, var(--text-main) 0%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 20px;
        }

        .hero-subtitle {
          font-size: 1.4rem;
          color: var(--text-muted);
          font-weight: 500;
          letter-spacing: 1px;
        }

        .hero-paragraphs {
          margin-top: 60px;
        }

        .hero-para-block {
          position: relative;
          padding-left: 40px;
          margin-bottom: 50px;
          transition: var(--transition);
        }

        .para-accent {
          position: absolute;
          left: 0;
          top: 10px;
          bottom: 10px;
          width: 5px;
          background: linear-gradient(to bottom, var(--primary), var(--secondary));
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(255, 112, 67, 0.4);
        }

        .hero-para-block p {
          font-size: 1.3rem;
          line-height: 1.9;
          color: var(--text-main);
          font-family: 'Inter', sans-serif;
        }

        .hero-para-block strong {
          color: var(--primary);
          position: relative;
          font-weight: 700;
        }

        .hero-para-block strong::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 0;
          width: 100%;
          height: 8px;
          background: rgba(255, 112, 67, 0.1);
          z-index: -1;
          border-radius: 4px;
        }

        .quote-section {
          text-align: center;
          margin-top: 100px;
          padding: 80px 40px;
          background: var(--white);
          border-radius: 40px;
          box-shadow: var(--shadow-lg);
          position: relative;
          border: 1px solid var(--glass-border);
        }

        .final-quote {
          font-size: 3rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-style: italic;
          line-height: 1.1;
        }

        .fade-in-up {
          animation: fadeInUp 1s ease forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
          .hero-para-block p { font-size: 1.15rem; }
          .final-quote { font-size: 2rem; }
        }

        .mission-list, .vision-list {
          margin-top: 20px;
          list-style: none;
          padding-left: 0;
        }

        .mission-list li, .vision-list li {
          margin-bottom: 12px;
          padding-left: 25px;
          position: relative;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .mission-list li::before {
          content: '✔';
          position: absolute;
          left: 0;
          color: var(--primary);
          font-weight: 700;
        }

        .vision-list li::before {
          content: '👁';
          position: absolute;
          left: 0;
          color: var(--secondary);
        }

        @media (max-width: 992px) {
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
          .page-header h1 { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
}
