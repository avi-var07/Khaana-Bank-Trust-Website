'use client';
import { useState } from 'react';

export default function BlogsPage() {
  const blogs = [
    {
      id: 1,
      title: "Food Distribution Drive in Rural Areas",
      date: "March 15, 2026",
      category: "Food",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070",
      description: "Our weekly drive reaching out to the most underprivileged families in remote villages."
    },
    {
      id: 2,
      title: "Monthly Blood Donation Camp Successful",
      date: "February 28, 2026",
      category: "Health",
      image: "https://images.unsplash.com/photo-1536856492748-81ae05668ca4?q=80&w=2070",
      description: "Over 50 units of blood collected in our latest health initiative."
    },
    {
      id: 3,
      title: "'Learn with Fun' Event at Primary School",
      date: "February 10, 2026",
      category: "Education",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2069",
      description: "Engaging children with creative learning methods and educational kits."
    },
    {
      id: 4,
      title: "Plantation Drive for a Greener Future",
      date: "January 20, 2026",
      category: "Environment",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013",
      description: "Planted 500 saplings across the local park and school grounds."
    }
  ];

  return (
    <div className="blogs-page">
      <section className="page-header">
        <div className="container">
          <h1>Blogs & Media</h1>
          <p>Sharing the impact and stories from the ground.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <div key={blog.id} className="blog-card glass-card fade-in">
                <div className="blog-image">
                  <img src={blog.image} alt={blog.title} />
                  <span className="category-badge">{blog.category}</span>
                </div>
                <div className="blog-content">
                  <span className="blog-date">{blog.date}</span>
                  <h3>{blog.title}</h3>
                  <p>{blog.description}</p>
                  <button className="btn btn-secondary-sm">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          padding: 80px 0;
          background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1495020689067-9d91f73bb3ad?q=80&w=2070') center/cover;
          color: white;
          text-align: center;
        }

        .page-header h1 { font-size: 3.5rem; margin-bottom: 10px; }
        .page-header p { font-size: 1.2rem; opacity: 0.9; }

        .section { padding: var(--section-padding); }

        .blogs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 40px;
        }

        .blog-card {
          overflow: hidden;
          transition: var(--transition);
        }

        .blog-card:hover { transform: translateY(-10px); }

        .blog-image {
          position: relative;
          height: 200px;
        }

        .blog-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: var(--primary);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .blog-content {
          padding: 25px;
        }

        .blog-date {
          display: block;
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 10px;
        }

        .blog-content h3 {
          font-size: 1.25rem;
          margin-bottom: 15px;
          line-height: 1.4;
        }

        .blog-content p {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .btn-secondary-sm {
          padding: 8px 20px;
          font-size: 0.85rem;
          border: 2px solid var(--primary);
          background: transparent;
          color: var(--primary);
          border-radius: 50px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-secondary-sm:hover {
          background: var(--primary);
          color: white;
        }

        @media (max-width: 768px) {
          .blogs-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
