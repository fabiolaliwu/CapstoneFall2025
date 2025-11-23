import './profile.css';
import Bar from '../homePage/bar';
import { useState, useEffect } from 'react';
import Modal from './modal';
import Avatar from './Avatar.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const safeBaseUrl = API_BASE_URL.replace(/\/$/, '');

function Profile({ currentUser }) {
  const [eventsPosted, setEventsPosted] = useState([]);
  const [incidentsPosted, setIncidentsPosted] = useState([]);
  const [selectEvent, setSelectEvent] = useState(null); 
  const [selectIncident, setSelectIncident] = useState(null); 
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("events");
  const [eventToEdit, setEventToEdit] = useState(null);

  // format date
  const formatForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - (offset * 60000));
    return local.toISOString().slice(0,16);
  };

  // fetch the user data once currentUser is available
  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchUserData = async () => {
      try {
        // fetch events created by this user
        const [eventsResponse, incidentsResponse, savedEventsResponse] = await Promise.all([
          fetch(`${safeBaseUrl}/api/events/user/${currentUser._id}`),
          fetch(`${safeBaseUrl}/api/incidents/user/${currentUser._id}`),
          fetch(`${safeBaseUrl}/api/users/${currentUser._id}/savedEvents`)
        ]);

        if (!eventsResponse.ok || !incidentsResponse.ok || !savedEventsResponse.ok) { throw new Error('Failed to fetch user posts'); }

        setEventsPosted(await eventsResponse.json());
        setIncidentsPosted(await incidentsResponse.json());
        setSavedEvents(await savedEventsResponse.json());
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // event and incident handlers 
  const handleEvent = async (event, action) => { 
    if (action === "delete") { 
      const confirmDelete = window.confirm(`Delete event "${event.title}"? This action cannot be undone.`);
      if (!confirmDelete) return;
      try {
        const response = await fetch(`${safeBaseUrl}/api/events/${event._id}`, { method: "DELETE" });
        if (response.ok) {
          setEventsPosted(prev => prev.filter(e => e._id !== event._id));
          alert(`Event "${event.title}" deleted successfully!`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleIncident = async (incident, action) => { 
    if (action === "delete") { 
      const confirmDelete = window.confirm(`Delete incident "${incident.title}"? This action cannot be undone.`);
      if (!confirmDelete) return; 
      try { 
        const response = await fetch(`${safeBaseUrl}/api/incidents/${incident._id}`, { method: "DELETE" }); 
        if (response.ok) { 
          setIncidentsPosted(prev => prev.filter(i => i._id !== incident._id)); 
          alert(`Incident "${incident.title}" deleted successfully!`);
        } 
      } catch (error) { 
        console.error(error);
      } 
    } 
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="profile-page">
      <Bar currentUser={currentUser} />

      {/* profile card */}
      <div className="profile-header-card">
        <Avatar currentUser={currentUser} />

        <div className="profile-info">
          <h2>{currentUser?.username || "Unknown User"}</h2>
          <p className="profile-sub">
            Neighborhood Member • Joined {new Date(currentUser.createdAt).getFullYear()}
          </p>

          <div className="profile-stats">
            <div><strong>{eventsPosted.length}</strong> Events</div>
            <div><strong>{incidentsPosted.length}</strong> Reports</div>
            <div><strong>{savedEvents.length}</strong> Saved</div>
          </div>
        </div>
      </div>

      {/* event / incident / saved tabs */}
      <div className="profile-tabs">
        <button onClick={() => setActiveTab("events")} className={activeTab==="events"?"active":""}>My Events</button>
        <button onClick={() => setActiveTab("reports")} className={activeTab==="reports"?"active":""}>Reports</button>
        <button onClick={() => setActiveTab("saved")} className={activeTab==="saved"?"active":""}>Saved</button>
      </div>

      {/* tab content */}
      <div className="profile-content-area">
      
        {/* Event List */}
        {activeTab === "events" && (
          <div className="card-list">
            {eventsPosted.length === 0 ? (
              <p>No events posted yet.</p>
            ) : eventsPosted.map(event => (
              <div className="item-card" key={event._id}>
                <div>
                  <h4>{event.title}</h4>
                  <p className="item-date">{new Date(event.start_date).toLocaleString()}</p>
                </div>

                <div className="item-actions">
                  <button onClick={() => handleEvent(event, "delete")}>Delete</button>
                  <button onClick={() => {
                    setEventToEdit({
                      ...event,
                      start_date: formatForInput(event.start_date),
                      end_date: formatForInput(event.end_date)
                    });
                    setShowModal(true);
                  }}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Incident List */}
        {activeTab === "reports" && (
          <div className="card-list">
            {incidentsPosted.length === 0 ? (
              <p>No reports submitted.</p>
            ) : incidentsPosted.map(incident => (
              <div className="item-card" key={incident._id}>
                <div>
                  <h4>{incident.title}</h4>
                  <p className="item-date">{new Date(incident.timestamp).toLocaleString()}</p>
                </div>

                <div className="item-actions">
                  <button onClick={() => handleIncident(incident, "delete")}>Delete</button>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Saved Event List */}
        {activeTab === "saved" && (
          <div className="card-list">
            {savedEvents.length === 0 ? (
              <p>No saved events yet.</p>
            ) : savedEvents.map(event => (
              <div className="item-card" key={event._id}>
                <h4>{event.title}</h4>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* EVENT EDIT MODAL */}
      {showModal && (
        <Modal
          eventData={eventToEdit}
          onClose={() => setShowModal(false)}
          onSave={(updated) => {
            setEventsPosted(prev =>
              prev.map(ev => ev._id === updated._id ? updated : ev)
            );
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

export default Profile;
