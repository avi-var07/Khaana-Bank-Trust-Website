'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [subscribers, setSubscribers] = useState([]);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '', type: 'General', location: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('isAdmin');
    if (auth !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAdmin(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const subRes = await fetch('/api/subscribe');
      const subData = await subRes.json();
      setSubscribers(Array.isArray(subData) ? subData : []);

      const eventRes = await fetch('/api/admin/events');
      const eventData = await eventRes.json();
      setEvents(Array.isArray(eventData) ? eventData : []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      if (res.ok) {
        setNewEvent({ title: '', date: '', description: '', type: 'General', location: '' });
        fetchData();
        alert('Event created successfully!');
      }
    } catch (err) {
      alert('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleNotify = async (eventId) => {
    if (!confirm('Are you sure you want to notify all subscribers about this event?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      });
      if (res.ok) {
        const result = await res.json();
        alert(`Notifications sent! Email: ${result.emailCount}, WhatsApp links generated.`);
      }
    } catch (err) {
      alert('Notification failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('isAdmin');
    router.push('/admin/login');
  };

  if (!isAdmin) return <div className="p-40">Verifying Admin...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar glass-card">
        <h3>Admin Panel</h3>
        <nav>
          <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}>Manage Events</button>
          <button className={activeTab === 'subs' ? 'active' : ''} onClick={() => setActiveTab('subs')}>Subscribers</button>
          <button onClick={logout} className="logout">Logout</button>
        </nav>
      </div>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab === 'events' ? 'Event Management' : 'Subscriber List'}</h1>
          <p>Logged in as Administrator</p>
        </header>

        {activeTab === 'events' ? (
          <div className="events-content fade-in">
            {/* Create Event Form */}
            <section className="admin-section glass-card">
              <h3>Create New Event</h3>
              <form onSubmit={handleCreateEvent} className="admin-form">
                <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px', display: 'grid' }}>
                  <div className="form-group">
                    <label>Event Title</label>
                    <input type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} required />
                  </div>
                </div>
                <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px', display: 'grid', marginTop: '20px' }}>
                  <div className="form-group">
                    <label>Type</label>
                    <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})}>
                      <option>General</option>
                      <option>Food</option>
                      <option>Blood</option>
                      <option>Education</option>
                      <option>Environment</option>
                      <option>Sports</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label>Description</label>
                  <textarea rows="3" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '20px' }}>
                  {loading ? 'Processing...' : 'Create & Save Event'}
                </button>
              </form>
            </section>

            {/* List Events */}
            <section className="admin-section glass-card" style={{ marginTop: '40px' }}>
              <h3>Existing Events</h3>
              <div className="admin-list">
                {events.length === 0 ? <p>No events found.</p> : events.map((ev, idx) => (
                  <div key={idx} className="admin-list-item">
                    <div>
                      <strong>{ev.title}</strong>
                      <p>{ev.date} - {ev.location}</p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => handleNotify(ev.id)} disabled={loading}>Notify All</button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="subs-content glass-card fade-in">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>WhatsApp</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.phone}</td>
                    <td>{new Date(s.subscribedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-dashboard {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 100vh;
          background: var(--surface);
          margin-top: -var(--header-height); /* Hide navbar impact for admin */
          padding-top: var(--header-height);
        }

        .admin-sidebar {
          margin: 20px;
          height: calc(100vh - 120px);
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
        }

        .admin-sidebar h3 { margin-bottom: 40px; color: var(--primary); }

        .admin-sidebar nav { display: flex; flex-direction: column; gap: 10px; }
        .admin-sidebar button {
          text-align: left;
          padding: 12px 20px;
          border-radius: 8px;
          border: none;
          background: transparent;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .admin-sidebar button.active { background: var(--primary); color: white; }
        .admin-sidebar button:hover:not(.active) { background: rgba(0,0,0,0.05); }

        .logout { margin-top: auto; color: var(--blood); }

        .admin-main { padding: 40px 60px; overflow-y: auto; }
        .admin-header { margin-bottom: 40px; }

        .admin-section { padding: 40px; margin-bottom: 30px; }
        .admin-form label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; }
        .admin-form input, .admin-form select, .admin-form textarea {
          width: 100%; border: 2px solid #eee; padding: 10px 15px; border-radius: 8px; outline: none; font-family: inherit;
        }

        .admin-list { margin-top: 20px; }
        .admin-list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
        .admin-table th { padding: 15px; border-bottom: 2px solid #eee; }
        .admin-table td { padding: 15px; border-bottom: 1px solid #eee; }
      `}</style>
    </div>
  );
}
