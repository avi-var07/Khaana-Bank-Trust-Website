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
    },
    {
      title: "Meet the Developers",
      members:[
        {
          name: "Aviral Ved Prakash Varshney",
          role: "Lead Developer",
          bio: "A visionary software developer dedicated to crafting seamless digital ecosystems and leading technological innovation at Khaana Bank Trust.",
          education: "B.Tech in Computer Science",
          from: "LPU",
          github: "https://github.com/",
          linkedin: "https://linkedin.com/in/",
          portfolio: "https://portfolio.com/"
        },
        {
          name: "Prashant Kumar Jhaa",
          role: "Full Stack Developer",
          bio: "Expert full-stack engineer focused on building robust architectures and intuitive user interfaces that drive social impact.",
          education: "B.Tech in Computer Science",
          from: "LPU",
          github: "https://github.com/",
          linkedin: "https://linkedin.com/in/",
          portfolio: "https://portfolio.com/"
        }
      ]
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
                  { (member.github || member.linkedin || member.portfolio) && (
                    <div className="member-socials">
                      {member.github && (
                        <a href={member.github} target="_blank" rel="noopener noreferrer" className="social-link github" title="GitHub">
                          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </a>
                      )}
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin" title="LinkedIn">
                          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                      )}
                      {member.portfolio && (
                        <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className="social-link portfolio" title="Portfolio">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        </a>
                      )}
                    </div>
                  )}
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

      .member-socials {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 25px;
        padding-top: 20px;
        border-top: 1px solid rgba(0,0,0,0.05);
      }

      .social-link {
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #f0f2f5;
        color: var(--text-muted);
        transition: var(--transition);
      }

      .social-link svg {
        width: 18px;
        height: 18px;
      }

      .social-link:hover {
        transform: translateY(-3px);
        color: white;
      }

      .social-link.github:hover { background: #333; }
      .social-link.linkedin:hover { background: #0077b5; }
      .social-link.portfolio:hover { background: var(--primary); }

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
