'use client';
export default function TeamPage() {
  const categories = [
    {
      title: "Our Trustees",
      members:[
        {
          name: "Mr. Ankit Tripathi",
          role: "Managing Trustee & Settler",
          education: "Master of Public Administration",
          from: "Swami Vivekananda Shubharti University",
          Prof: "Deputy Manager at HDFC Bank Ltd" 
        },
        {
          name: "Mr. Praveen Agrahari",
          role: "Trustee",
          education: "Master of Commerce",
          from: "Mahatma Gandhi Kashi Vidyapeeth",
          Prof: "Assistant Manager at Reliance Nippon Life Insurance" 
        },
        {
          name: "Mr. Prajwal Jaiswal",
          role: "Trustee",
          education: "Bachelor of Computer Applications",
          from: "Swami Vivekananda Shubharti University",
          Prof: "Software Engineer at Aivree Pvt. Ltd" 
        },
        {
          name: "Mr. Abhishek Gupta",
          role: "Trustee",
          education: "Bachelor of Arts",
          from: "Mahatma Gandhi Kashi Vidyapeeth",
          Prof: "Business Owner" 
        },
        {
          name: "Mr. Saroj Kumar Tiwari",
          role: "Trustee",
          education: "Bachelor of Commerce",
          from: "Banaras Hindu University",
          Prof: "Business Owner" 
        },
        {
          name: "Mr. Ashok Kumar Agrahari",
          role: "Trustee",
          education: "Bachelor of Arts",
          from: "Veer Bahadur Singh Purvanchal University",
          Prof: "Business Owner" 
        }
      ]
    },
    {
      title: "Our Team",
      members: [
        {
          name: "Mr. Ankit Tripathi",
          role: "Founder/President",
          Prof: "Deputy Manager at HDFC Bank Ltd"
        },
        {
          name: "Mr. Praveen Agrahari",
          role: "Chief Secretary/Treasurer",
          Prof: "Assistant Manager at Reliance Nippon Life Insurance"
        },
        {
          name: "Mr. Prajwal Jaiswal",
          role: "Member",
          Prof: "Software Engineer at Aivree Pvt. Ltd"
        },
        {
          name: "Mr. Abhishek Gupta",
          role: "Member",
          Prof: "Business Owner"
        },
        {
          name: "Mrs. Shiwangini Sharma",
          role: "Member",
          Prof: "Deputy Manager at HDFC Bank Ltd"
        },
        {
          name: "Mrs. Singarika Sharma",
          role: "Member",
          Prof: "Freelancer & Graphic Designer"
        },
        {
          name: "Mr. Nitesh Seth",
          role: "Member",
          Prof: "Business Owner"
        },
        {
          name: "Mr. Ravi Seth",
          role: "Member",
          Prof: "Business Owner"
        },
        {
          name: "Mr. Ashutosh Jaiswal",
          role: "Member",
          Prof: "Business Owner"
        },
        {
          name: "Mr. Amit Chauhan",
          role: "Member",
          Prof: "Business Owner"
        },
        {
          name: "Mr. Amit Prajapati",
          role: "Member",
          Prof: "Professional Dance Choreographer & Teacher"
        },
        {
          name: "Mr. Surya Pratap Gupta",
          role: "Member",
          Prof: "Business Owner"
        },
        {
          name: "Mr. Ankesh Srivastava",
          role: "Member",
          Prof: "Business Owner"
        },
        {
          name: "Mr. Vicky Kumar",
          role: "Member",
          Prof: "Business Owner"
        },
      ]
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
              <div key={mIdx} className="team-card glass-card fade-in" style={{ animationDelay: `${mIdx * 0.1}s` }}>
                <div className="card-accent"></div>
                <div className="member-photo-container">
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
                    <div className="photo-placeholder" style={{ display: 'none' }}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 16.66 14.67 14 12 14Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <h3>{member.name}</h3>
                  <p className="role"><span>{member.role}</span></p>
                  {member.bio && <p className="bio">{member.bio}</p>}
                  <div className="member-details">
                    <div className="detail-item">
                      <span className="label">Education:</span>
                      <span className="value">{member.education || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Institution:</span>
                      <span className="value">{member.from || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Profession:</span>
                      <span className="value">{member.Prof || member.profession || 'N/A'}</span>
                    </div>
                  </div>
                </div>
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
        padding: 120px 0;
        background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084') center/cover;
        color: white;
        text-align: center;
        margin-bottom: -40px;
        clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
      }

      .page-header h1 { font-size: 4rem; margin-bottom: 15px; letter-spacing: -1px; }
      .page-header p { font-size: 1.35rem; opacity: 0.9; font-weight: 300; }

      .section { padding: 80px 0; }
      .bg-light { background: #fdfdfd; }
      .bg-primary-light { background: linear-gradient(135deg, rgba(255, 112, 67, 0.05) 0%, rgba(255, 167, 38, 0.05) 100%); }

      .team-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: 40px;
        padding: 20px 0;
      }

      .team-card {
        position: relative;
        text-align: center;
        padding: 40px 30px;
        transition: var(--transition);
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        border: 1px solid rgba(255, 112, 67, 0.1);
        background: rgba(255, 255, 255, 0.9);
      }

      .team-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 6px;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        opacity: 0.3;
        transition: var(--transition);
      }

      .team-card:hover { 
        transform: translateY(-12px); 
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        border-color: var(--primary);
      }

      .team-card:hover::before {
        opacity: 1;
      }

      .card-accent {
        position: absolute;
        top: -50px;
        right: -50px;
        width: 100px;
        height: 100px;
        background: var(--primary);
        opacity: 0.03;
        border-radius: 50%;
        transition: var(--transition);
      }

      .team-card:hover .card-accent {
        transform: scale(3);
        opacity: 0.05;
      }

      .member-photo-container {
        position: relative;
        margin-bottom: 25px;
        z-index: 1;
      }

      .member-photo-container::after {
        content: '';
        position: absolute;
        inset: -8px;
        border: 2px dashed var(--primary);
        border-radius: 50%;
        opacity: 0.2;
        animation: rotate 10s linear infinite;
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .member-photo {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        overflow: hidden;
        border: 5px solid white;
        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        background: var(--surface);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .photo-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .photo-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        color: var(--primary);
      }

      .photo-placeholder svg {
        width: 60px;
        height: 60px;
        opacity: 0.6;
      }

      .card-content {
        width: 100%;
      }

      .team-card h3 { 
        font-size: 1.6rem; 
        margin-bottom: 8px; 
        color: var(--text-main);
        font-weight: 800;
      }

      .role { 
        margin-bottom: 20px; 
      }

      .role span {
        background: rgba(255, 112, 67, 0.1);
        color: var(--primary);
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .bio { 
        font-size: 1rem; 
        color: var(--text-muted); 
        margin-bottom: 25px;
        font-style: italic;
        line-height: 1.5;
      }

      .member-details {
        text-align: left;
        background: rgba(0,0,0,0.02);
        padding: 20px;
        border-radius: 15px;
        width: 100%;
      }

      .detail-item {
        margin-bottom: 12px;
        display: flex;
        flex-direction: column;
      }

      .detail-item:last-child { margin-bottom: 0; }

      .detail-item .label {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--primary);
        font-weight: 800;
        letter-spacing: 0.5px;
        margin-bottom: 2px;
      }

      .detail-item .value {
        font-size: 0.95rem;
        color: var(--text-main);
        font-weight: 500;
      }

      .text-center { text-align: center; }

      .intern-cta {
        padding: 80px 40px;
        max-width: 900px;
        margin: 0 auto;
        position: relative;
        background: white;
        border: none;
        box-shadow: 0 30px 60px rgba(0,0,0,0.08);
      }

      .intern-cta h2 { font-size: 2.5rem; margin-bottom: 20px; }
      .intern-cta p { margin-bottom: 40px; font-size: 1.25rem; color: var(--text-muted); }

      @media (max-width: 768px) {
        .page-header { padding: 80px 0; clip-path: none; }
        .page-header h1 { font-size: 2.8rem; }
        .team-grid { grid-template-columns: 1fr; gap: 30px; }
        .team-card { padding: 30px 20px; }
        .member-photo { width: 140px; height: 140px; }
        .intern-cta { padding: 50px 25px; }
      }
    `}</style>
    </div>
  );
}
