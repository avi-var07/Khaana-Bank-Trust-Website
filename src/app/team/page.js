'use client';
import { useState } from 'react';
import './team.css';

export default function TeamPage() {
  const [zoomPhoto, setZoomPhoto] = useState(null);

  const trustees = [
    { name: "Mr. Ankit Tripathi", role: "Managing Trustee & Settler", education: "Master of Public Administration", from: "Swami Vivekananda Shubharti University", Prof: "Deputy Manager at HDFC Bank Ltd", photo: "/images/team/Ankit Bhaiya.png" },
    { name: "Mr. Praveen Agrahari", role: "Trustee", education: "Master of Commerce", from: "Mahatma Gandhi Kashi Vidyapeeth", Prof: "Assistant Manager at Reliance Nippon Life Insurance", photo: "/images/team/Praveen Agrahari.jpeg" },
    { name: "Mr. Saroj Kumar Tiwari", role: "Trustee", education: "Bachelor of Commerce", from: "Banaras Hindu University", Prof: "Business Owner" },
    { name: "Mr. Ashok Kumar Agrahari", role: "Trustee", education: "Bachelor of Arts", from: "Veer Bahadur Singh Purvanchal University", Prof: "Business Owner" }
  ];

  const teamMembers = [
    { name: "Mr. Ankit Tripathi", role: "Founder/President", Prof: "Deputy Manager at HDFC Bank Ltd", photo: "/images/team/Ankit Bhaiya.png" },
    { name: "Mr. Praveen Agrahari", role: "Chief Secretary/Treasurer", Prof: "Assistant Manager at Reliance Nippon Life Insurance", photo: "/images/team/Praveen Agrahari.jpeg" },
    { name: "Mr. Prajwal Jaiswal", role: "Member", Prof: "Software Engineer at Aivree Pvt. Ltd" },
    { name: "Mr. Abhishek Gupta", role: "Member", Prof: "Business Owner" },
    { name: "Mrs. Shiwangini Sharma", role: "Member", Prof: "Deputy Manager at HDFC Bank Ltd" },
    { name: "Mrs. Singarika Sharma", role: "Member", Prof: "Freelancer & Graphic Designer" },
    { name: "Mr. Nitesh Soni", role: "Member", Prof: "Business Owner", photo: "/images/team/Nitesh Soni.jpeg" },
    { name: "Mr. Ravi Seth", role: "Member", Prof: "Business Owner", photo: "/images/team/Ravi Seth.jpeg" },
    { name: "Mr. Ashutosh Jaiswal", role: "Member", Prof: "Business Owner", photo: "/images/team/Ashutosh Jaiswal.jpeg" },
    { name: "Mr. Amit Chaurasiya", role: "Member", Prof: "Business Owner", photo: "/images/team/Amit Chaurasiya.jpeg" },
    { name: "Mr. Amit Prajapati", role: "Member", Prof: "Professional Dance Choreographer & Teacher", photo: "/images/team/Amit Prajapati.jpeg" },
    { name: "Mr. Surya Pratap Gupta", role: "Member", Prof: "Business Owner", photo: "/images/team/Surya Pratap Gupta.jpeg" },
    { name: "Mr. Ankesh Srivastava", role: "Member", Prof: "Business Owner", photo: "/images/team/Ankesh Srivastava.jpeg" },
    { name: "Mr. Shubham Jaiswal", role: "Member", Prof: "Business Owner", photo: "/images/team/Shubham Jaiswal.jpeg" },
  ];

  const mentors = [
    { name: "RJ Shashank", role: "Strategic Advisor", bio: "Voice of Change and social impact advocate.", photo: "/images/mentors/RJ Shashank.jpeg" },
    { name: "Dr. Amit Chandra", role: "Mentor", bio: "Healthcare policy expert and philanthropic leader.", photo: "/images/mentors/Dr Amit Chandra.jpeg" },
    { name: "Dr. Abhimanyu Pandey", role: "Mentor", bio: "Dedicated to community health and sustainable development.", photo: "/images/mentors/Dr Abhimanyu Pandey.jpeg" },
    { name: "Dr. Payal Jaiswal", role: "Mentor", bio: "Passionate about women's education and social welfare.", photo: "/images/mentors/Dr Payal Jaiswal.jpeg" },
    { name: "Pradeep Mishra", role: "Mentor", bio: "Guiding our growth with strategic insights.", photo: "/images/mentors/Pradeep Mishra .jpeg" },
    { name: "Anirudh Singh", role: "Mentor", bio: "Logistics and operational excellence expert.", photo: "/images/mentors/Anirudh Singh.jpeg" },
    { name: "Ashutosh Tiwari", role: "Mentor", bio: "Social entrepreneur focusing on rural empowerment.", photo: "/images/mentors/Ashutosh Tiwari.jpeg" }
  ];

  const developers = [
    { name: "Aviral Ved Prakash Varshney", role: "Lead Developer", bio: "A visionary software developer dedicated to crafting seamless digital ecosystems and leading technological innovation at Khaana Bank Trust.", photo: "/images/Aviral.png", education: "B.Tech in Computer Science", from: "LPU", github: "https://github.com/", linkedin: "https://linkedin.com/in/", portfolio: "https://portfolio.com/" },
    { name: "Prashant Kumar Jhaa", role: "Full Stack Developer", bio: "Expert full-stack engineer focused on building robust architectures and intuitive user interfaces that drive social impact.", photo: "/images/Jhaaan.png", education: "B.Tech in Computer Science", from: "LPU", github: "https://github.com/", linkedin: "https://linkedin.com/in/", portfolio: "https://portfolio.com/" }
  ];

  const conveyers = Array(4).fill().map((_, i) => ({ name: `Conveyer ${i + 1}`, role: "Project Coordinator", bio: "Liaising between donors and our field volunteers." }));
  const partners = Array(4).fill().map((_, i) => ({ name: `Partner ${i + 1}`, role: "Corporate/NGO Partner", bio: "Collaborating for a wider reach and more significant social change." }));

  const getInitials = (name) => name.split(' ').filter(w => !['Mr.', 'Mrs.', 'Ms.', 'Dr.'].includes(w)).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const PhotoCircle = ({ member, size = 150 }) => {
    const [err, setErr] = useState(false);
    const hasPhoto = member.photo && !err;
    return (
      <div className="photo-circle-wrap" style={{ width: size, height: size }} onClick={() => hasPhoto && setZoomPhoto(member)}>
        <div className="photo-ring"></div>
        <div className="photo-circle">
          {hasPhoto ? (
            <img src={member.photo} alt={member.name} onError={() => setErr(true)} />
          ) : (
            <div className="photo-initials">{getInitials(member.name)}</div>
          )}
        </div>
      </div>
    );
  };

  const renderSection = (title, subtitle, icon, members, type) => (
    <section className={`tp-section ${type === 'team' || type === 'conveyer' ? 'tp-section--alt' : ''}`}>
      <div className="container">
        <div className="tp-section-head">
          <div className="tp-section-icon" dangerouslySetInnerHTML={{ __html: icon }} />
          <h2>{title}</h2>
          <p>{subtitle}</p>
          <div className="tp-head-bar"></div>
        </div>
        <div className={`tp-grid tp-grid--${type}`}>
          {members.map((m, i) => (
            <div key={i} className="tp-card" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="tp-card-top-line"></div>
              <PhotoCircle member={m} size={type === 'trustee' ? 130 : 140} />
              <h3>{m.name}</h3>
              <span className="tp-role">{m.role}</span>
              {m.bio && <p className="tp-bio">{m.bio}</p>}
              <div className="tp-details">
                {m.education && <div className="tp-detail"><span className="tp-detail-label">Education</span><span>{m.education}</span></div>}
                {m.from && <div className="tp-detail"><span className="tp-detail-label">Institution</span><span>{m.from}</span></div>}
                {m.Prof && <div className="tp-detail"><span className="tp-detail-label">Profession</span><span>{m.Prof}</span></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="team-page-v2">
      {/* ===== HERO ===== */}
      <section className="tp-hero">
        <div className="tp-hero-bg">
          <div className="tp-hero-orb tp-hero-orb--1"></div>
          <div className="tp-hero-orb tp-hero-orb--2"></div>
          <div className="tp-hero-grid"></div>
        </div>
        <div className="container tp-hero-content">
          <span className="tp-hero-badge">👥 Our People</span>
          <h1>The Hearts Behind<br /><span className="tp-gradient">Khaana Bank Trust</span></h1>
          <p>Meet the dedicated individuals who work tirelessly to ensure no one goes hungry.</p>
          <div className="tp-hero-stats">
            <div className="tp-stat"><strong>6</strong><span>Trustees</span></div>
            <div className="tp-stat-line"></div>
            <div className="tp-stat"><strong>15+</strong><span>Team Members</span></div>
            <div className="tp-stat-line"></div>
            <div className="tp-stat"><strong>7</strong><span>Mentors</span></div>
          </div>
        </div>
      </section>

      {/* ===== SECTIONS ===== */}
      {renderSection("Our Trustees", "The visionary leaders steering our mission forward", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="26" height="26"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>', trustees, 'trustee')}
      {renderSection("Our Team", "The passionate individuals making impact on the ground", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="26" height="26"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>', teamMembers, 'team')}
      {renderSection("Our Mentors", "Wisdom and experience guiding our journey", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="26" height="26"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>', mentors, 'mentor')}
      {renderSection("Our Conveyers", "Bridging the gap between support and those in need", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="26" height="26"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>', conveyers, 'conveyer')}
      {renderSection("Our Partners", "Together we amplify impact and create lasting change", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="26" height="26"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65l.78.77L12 20.65l7.65-7.65.77-.77a5.4 5.4 0 000-7.65z"/></svg>', partners, 'partner')}

      {/* ===== DEVELOPERS SHOWCASE ===== */}
      <section className="tp-dev-section">
        <div className="tp-dev-bg">
          <div className="tp-dev-glow tp-dev-glow--1"></div>
          <div className="tp-dev-glow tp-dev-glow--2"></div>
          <div className="tp-dev-grid-lines"></div>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="tp-particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 3}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`
            }}></div>
          ))}
        </div>

        <div className="container tp-dev-container">
          <div className="tp-dev-header">
            <div className="tp-dev-badge">
              <span className="tp-bracket">&lt;</span> Built with <span className="tp-heart">❤️</span> <span className="tp-bracket">/&gt;</span>
            </div>
            <h2>Meet the <span className="tp-gradient">Developers</span></h2>
            <p>The architects behind this digital platform — turning code into tools for social impact.</p>
            <div className="tp-dev-line"><div className="tp-dev-dot"></div></div>
          </div>

          <div className="tp-dev-cards">
            {developers.map((dev, i) => (
              <div key={i} className="tp-dev-card">
                {/* Terminal header */}
                <div className="tp-dev-topbar">
                  <div className="tp-dots"><span className="tp-dot tp-dot--r"></span><span className="tp-dot tp-dot--y"></span><span className="tp-dot tp-dot--g"></span></div>
                  <span className="tp-dev-filename">developer_{i}.profile</span>
                </div>

                <div className="tp-dev-body">
                  {/* Photo */}
                  <div className="tp-dev-photo-wrap" onClick={() => setZoomPhoto(dev)}>
                    <div className="tp-dev-photo-glow"></div>
                    <img src={dev.photo} alt={dev.name} className="tp-dev-photo" />
                    <div className="tp-dev-photo-hover">
                      <span>🔍 View Full Photo</span>
                    </div>
                  </div>

                  <h3>{dev.name}</h3>
                  <span className="tp-dev-role">{dev.role}</span>
                  <p className="tp-dev-bio">{dev.bio}</p>

                  <div className="tp-dev-info">
                    <div className="tp-dev-info-row">
                      <span className="tp-dev-info-label">🎓 Education</span>
                      <span className="tp-dev-info-value">{dev.education}</span>
                    </div>
                    <div className="tp-dev-info-row">
                      <span className="tp-dev-info-label">🏫 University</span>
                      <span className="tp-dev-info-value">{dev.from}</span>
                    </div>
                  </div>

                  <div className="tp-dev-socials">
                    {dev.github && <a href={dev.github} target="_blank" rel="noopener noreferrer" className="tp-dev-soc tp-dev-soc--gh">GitHub</a>}
                    {dev.linkedin && <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="tp-dev-soc tp-dev-soc--li">LinkedIn</a>}
                    {dev.portfolio && <a href={dev.portfolio} target="_blank" rel="noopener noreferrer" className="tp-dev-soc tp-dev-soc--pf">Portfolio</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="tp-cta-section">
        <div className="container">
          <div className="tp-cta">
            <h2>Want to make a difference?</h2>
            <p>Join Khaana Bank Trust as an intern and contribute to our various social initiatives while gaining valuable experience.</p>
            <a href="/contact?subject=Join as Intern" className="btn btn-primary">Apply as an Intern</a>
          </div>
        </div>
      </section>

      {/* ===== ZOOM MODAL ===== */}
      {zoomPhoto && (
        <div className="tp-zoom-overlay" onClick={() => setZoomPhoto(null)}>
          <div className="tp-zoom-box" onClick={(e) => e.stopPropagation()}>
            <button className="tp-zoom-close" onClick={() => setZoomPhoto(null)}>✕</button>
            <div className="tp-zoom-img">
              <img src={zoomPhoto.photo} alt={zoomPhoto.name} />
            </div>
            <div className="tp-zoom-info">
              <h3>{zoomPhoto.name}</h3>
              <span>{zoomPhoto.role}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
