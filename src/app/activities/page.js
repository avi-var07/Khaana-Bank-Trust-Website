'use client';
export default function ActivitiesPage() {
  const activities = [
    {
      id: 1,
      title: "Food Distribution",
      icon: "🍲",
      color: "var(--primary)",
      description: "Daily house-to-house food collection and distribution to the needy. We also manage leftover food from events and prepare food from raw materials provided by donors.",
      detail: "Our network connects daily with local families who provide surplus food. During events, our team is on standby to collect and distribute leftovers immediately, ensuring zero wastage."
    },
    {
      id: 2,
      title: "Blood Donation Camp",
      icon: "🩸",
      color: "var(--blood)",
      description: "We conduct blood donation camps 2-3 times a month in cooperation with our medical partners to ensure a steady supply for those in need.",
      detail: "Regularly organized in various neighborhoods, our camps follow strict safety protocols and are supported by certified medical professionals."
    },
    {
      id: 3,
      title: "Learn with Fun",
      icon: "📚",
      color: "#2196F3",
      description: "Education support and extracurricular activities for rural students, using modern learning methodologies to encourage school attendance.",
      detail: "From interactive workshops to providing learning materials, we focus on making education accessible and enjoyable for underprivileged children."
    },
    {
      id: 4,
      title: "Tree Plantation Drives",
      icon: "🌳",
      color: "var(--accent)",
      description: "Conducting afforestation drives in schools and colleges, and taking long-term care of the planted trees to ensure their survival.",
      detail: "We believe in planting a future. Our drives involve community participation and educational awareness about local biodiversity."
    },
    {
      id: 5,
      title: "Sports & Wellness",
      icon: "⚽",
      color: "#fbc02d",
      description: "Promoting physical fitness among youth through sports events, yoga sessions, and exercise awareness programs.",
      detail: "We organize local tournaments and regular yoga camps to keep our community active, healthy, and disciplined."
    },
    {
      id: 6,
      title: "Extra Activities",
      icon: "🏠",
      color: "#9c27b0",
      description: "Providing shelter, support for verified old age homes, and essential medicines to those who cannot afford them.",
      detail: "We act as a bridge for verified old age homes and shelter services, ensuring that the elderly and infirm receive the care they deserve."
    }
  ];

  return (
    <div className="activities-page">
      <section className="page-header">
        <div className="container">
          <h1>Our Activities</h1>
          <p>Impacting lives through diverse social initiatives.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="activities-grid">
            {activities.map((act) => (
              <div key={act.id} className="activity-card glass-card fade-in" style={{ '--accent-color': act.color }}>
                <div className="card-icon">{act.icon}</div>
                <h3>{act.title}</h3>
                <p className="desc">{act.description}</p>
                <div className="detail-box">
                   <p>{act.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          padding: 80px 0;
          background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070') center/cover;
          color: white;
          text-align: center;
        }

        .page-header h1 { font-size: 3.5rem; margin-bottom: 10px; }
        .page-header p { font-size: 1.2rem; opacity: 0.9; }

        .section { padding: var(--section-padding); }

        .activities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 40px;
        }

        .activity-card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 40px;
          border-top: 5px solid var(--accent-color);
          overflow: hidden;
          transition: var(--transition);
        }

        .activity-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-lg);
        }

        .card-icon {
          font-size: 3rem;
          margin-bottom: 25px;
        }

        h3 {
          font-size: 1.6rem;
          margin-bottom: 20px;
          color: var(--text-main);
        }

        .desc {
          font-size: 1rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .detail-box {
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 0.95rem;
          color: var(--text-main);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .activities-grid { grid-template-columns: 1fr; }
          .page-header h1 { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
}
