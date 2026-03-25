'use client';
export default function EventsPage() {
  const events = [
    {
      title: "Mega Blood Donation Camp",
      date: "August 15, 2025",
      type: "Health",
      desc: "Celebrating Independence Day by giving the gift of life. Target: 100 units.",
      location: "Central Park Community Hall"
    },
    {
      title: "Annual Sports Meet",
      date: "January 12, 2025",
      type: "Youth",
      desc: "Promoting physical fitness and team spirit among rural youth on National Youth Day.",
      location: "District Sports Ground"
    },
    {
       title: "Afforestation Drive",
       date: "June 5, 2024",
       type: "Environment",
       desc: "Planted over 500 saplings in collaboration with local schools on World Environment Day.",
       location: "Riverside Plantation Site"
    }
  ];

  const awards = [
    { title: "Young Humanitarian Award", year: "2024", giver: "City Municipal Corp" },
    { title: "Best Social Initiative", year: "2023", giver: "Unity Foundation" }
  ];

  return (
    <div className="events-page">
      <section className="page-header">
        <div className="container">
          <h1>Events & Awards</h1>
          <p>Celebrating our milestones and upcoming activities.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Upcoming & Recent Events</h2>
          </div>
          <div className="events-timeline">
            {events.map((event, idx) => (
              <div key={idx} className="event-item fade-in">
                <div className="event-date">
                  <span className="date-icon">📅</span>
                  {event.date}
                </div>
                <div className="event-card glass-card">
                  <span className={`event-badge ${event.type.toLowerCase()}`}>{event.type}</span>
                  <h3>{event.title}</h3>
                  <p className="desc">{event.desc}</p>
                  <div className="loc">📍 {event.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <div className="section-title">
            <h2>Awards & Recognition</h2>
            <p>Humbled by the recognition of our community's hard work.</p>
          </div>
          <div className="awards-grid">
            {awards.map((award, idx) => (
              <div key={idx} className="award-card glass-card text-center">
                <div className="award-icon">🏆</div>
                <h3>{award.title}</h3>
                <p className="year">{award.year}</p>
                <p className="giver">By {award.giver}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          padding: 80px 0;
          background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069') center/cover;
          color: white;
          text-align: center;
        }

        .page-header h1 { font-size: 3.5rem; margin-bottom: 10px; }
        .page-header p { font-size: 1.2rem; opacity: 0.9; }

        .section { padding: var(--section-padding); }
        .bg-light { background: var(--surface); }

        .events-timeline {
          max-width: 900px;
          margin: 0 auto;
        }

        .event-item {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 40px;
          margin-bottom: 50px;
        }

        .event-date {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          color: var(--primary);
          font-family: 'Outfit', sans-serif;
          padding-top: 20px;
        }

        .event-card {
          padding: 30px;
          position: relative;
        }

        .event-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 15px;
          color: white;
        }

        .event-badge.health { background: var(--blood); }
        .event-badge.youth { background: #2196F3; }
        .event-badge.environment { background: var(--accent); }

        .event-card h3 { margin-bottom: 15px; }
        .desc { color: var(--text-muted); margin-bottom: 20px; }
        .loc { font-size: 0.9rem; font-weight: 600; color: var(--text-main); }

        .awards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
          max-width: 800px;
          margin: 0 auto;
        }

        .award-card { padding: 40px; transition: var(--transition); }
        .award-card:hover { transform: translateY(-5px); }
        .award-icon { font-size: 3.5rem; margin-bottom: 20px; }
        .award-card h3 { font-size: 1.4rem; margin-bottom: 10px; }
        .year { color: var(--primary); font-weight: 800; font-size: 1.2rem; margin-bottom: 5px; }
        .giver { color: var(--text-muted); }

        .text-center { text-align: center; }

        @media (max-width: 768px) {
          .event-item { grid-template-columns: 1fr; gap: 10px; }
          .awards-grid { grid-template-columns: 1fr; }
          .page-header h1 { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
}
