'use client';
export default function TeamPage() {
  const categories = [
    {
      title: "Our Trustees",
      count: 6,
      defaultRole: "Trustee",
      members: Array(6).fill().map((_, i) => ({ 
        name: i === 0 ? "Mr. Ankit Tripathi" : `Trustee ${i + 1}`, 
        role: "Trustee", 
        bio: i === 0 ? "Founder & Director of Khaana Bank Trust, dedicated to social reform." : "Dedicated member of the Board of Trustees." 
      }))
    },
    {
      title: "Our Members",
      count: 14,
      defaultRole: "Member",
      members: Array(14).fill().map((_, i) => ({ 
        name: i < 6 ? `Trustee ${i + 1}` : `Member ${i - 5}`, 
        role: i < 6 ? "Trustee & Member" : "Executive Member", 
        bio: "Actively contributing to the growth and impact of the NGO." 
      }))
    },
    {
      title: "Our Mentors",
      count: 4,
      defaultRole: "Mentor",
      members: Array(4).fill().map((_, i) => ({ 
        name: `Mentor ${i + 1}`, 
        role: "Strategic Advisor", 
        bio: "Providing guidance on sustainability and scaling our impact." 
      }))
    },
    {
      title: "Our Conveyers",
      count: 4,
      defaultRole: "Conveyer",
      members: Array(4).fill().map((_, i) => ({ 
        name: `Conveyer ${i + 1}`, 
        role: "Project Coordinator", 
        bio: "Liaising between donors and our field volunteers." 
      }))
    },
    {
      title: "Our Partners",
      count: 4,
      defaultRole: "Partner",
      members: Array(4).fill().map((_, i) => ({ 
        name: `Partner ${i + 1}`, 
        role: "Corporate/NGO Partner", 
        bio: "Collaborating for a wider reach and more significant social change." 
      }))
    }
  ];

  return (
    <div className="team-page">
      <section className="page-header">
        <div className="container">
          <h1>Our Team</h1>
          <p>The dedicated hearts behind Khaana Bank Trust.</p>
        </div>
      </section>

      {categories.map((cat, idx) => (
        <section key={idx} className={`section ${idx % 2 !== 0 ? 'bg-light' : ''}`}>
          <div className="container">
            <div className="section-title">
              <h2>{cat.title}</h2>
            </div>
            <div className="team-grid">
              {cat.members.map((member, mIdx) => (
                <div key={mIdx} className="team-card glass-card fade-in">
                  <div className="member-photo">
                    <img 
                      src={`/images/team/${member.name.toLowerCase().replace(/\s+/g, '_')}.jpg`} 
                      alt={member.name}
                      className="photo-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="photo-placeholder" style={{ display: 'none' }}>👤</div>
                  </div>
                  <h3>{member.name}</h3>
                  <p className="role">{member.role}</p>
                  <p className="bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Intern CTA */}
      <section className="section bg-primary-light">
        <div className="container text-center">
          <div className="intern-cta glass-card">
            <h2>Want to make a difference?</h2>
            <p>Join Khaana Bank Trust as an intern and contribute to our various social initiatives while gaining valuable experience.</p>
            <a href="/contact?subject=Join as Intern" className="btn btn-primary">Apply as an Intern</a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          padding: 80px 0;
          background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084') center/cover;
          color: white;
          text-align: center;
        }

        .page-header h1 { font-size: 3.5rem; margin-bottom: 10px; }
        .page-header p { font-size: 1.2rem; opacity: 0.9; }

        .section { padding: var(--section-padding); }
        .bg-light { background: var(--surface); }
        .bg-primary-light { background: rgba(255, 112, 67, 0.05); }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
        }

        .team-card {
          text-align: center;
          padding: 30px;
          transition: var(--transition);
        }

        .team-card:hover { transform: translateY(-5px); }

        .photo-img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--primary);
          margin-bottom: 20px;
        }

        .photo-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          margin: 0 auto 20px;
          border: 4px solid var(--primary);
        }

        .team-card h3 { font-size: 1.3rem; margin-bottom: 5px; }
        .role { color: var(--primary); font-weight: 700; margin-bottom: 15px; font-size: 0.9rem; text-transform: uppercase; }
        .bio { font-size: 0.95rem; color: var(--text-muted); }

        .text-center { text-align: center; }

        .intern-cta {
          padding: 60px;
          max-width: 800px;
          margin: 0 auto;
        }

        .intern-cta h2 { margin-bottom: 20px; }
        .intern-cta p { margin-bottom: 30px; font-size: 1.1rem; color: var(--text-muted); }

        @media (max-width: 768px) {
          .team-grid { grid-template-columns: 1fr; }
          .intern-cta { padding: 40px 20px; }
        }
      `}</style>
    </div>
  );
}
