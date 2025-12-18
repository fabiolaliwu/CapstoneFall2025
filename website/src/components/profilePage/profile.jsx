import './profile.css';
import Bar from '../homePage/bar';
import { useState, useEffect } from 'react';
import Modal from './modal';
import Avatar from './Avatar.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const safeBaseUrl = API_BASE_URL.replace(/\/$/, '');

function Profile({ currentUser, onLogout }) {
  const [eventsPosted, setEventsPosted] = useState([]);
  const [incidentsPosted, setIncidentsPosted] = useState([]);
  const [selectEvent, setSelectEvent] = useState(null); 
  const [selectIncident, setSelectIncident] = useState(null); 
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("events");
  const [eventToEdit, setEventToEdit] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [confirmPopup, setConfirmPopup] = useState({
    open: false,
    type: null,
    item: null,
  });

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
        const [eventsResponse, incidentsResponse, savedEventsResponse] = await Promise.all([
          fetch(`${safeBaseUrl}/api/events/user/${currentUser._id}`),
          fetch(`${safeBaseUrl}/api/incidents/user/${currentUser._id}`),
          fetch(`${safeBaseUrl}/api/users/${currentUser._id}/savedEvents`)
        ]);

        if (!eventsResponse.ok || !incidentsResponse.ok || !savedEventsResponse.ok) {
          throw new Error('Failed to fetch user posts');
        }

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

  /* 🔹 delete request handlers (added) */
  const requestDeleteEvent = (event) => {
    setConfirmPopup({ open: true, type: "event", item: event });
  };

  const requestDeleteIncident = (incident) => {
    setConfirmPopup({ open: true, type: "incident", item: incident });
  };

  const confirmDelete = async () => {
    const { type, item } = confirmPopup;

    try {
      const url =
        type === "event"
          ? `${safeBaseUrl}/api/events/${item._id}`
          : `${safeBaseUrl}/api/incidents/${item._id}`;

      const response = await fetch(url, { method: "DELETE" });

      if (response.ok) {
        if (type === "event") {
          setEventsPosted(prev => prev.filter(e => e._id !== item._id));
          setPopupMessage(`Event "${item.title}" deleted successfully.`);
        } else {
          setIncidentsPosted(prev => prev.filter(i => i._id !== item._id));
          setPopupMessage(`Incident "${item.title}" deleted successfully.`);
        }

        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 5000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmPopup({ open: false, type: null, item: null });
    }
  };

  const handleUnsaveEvent = async (eventId) => {
    try {
      const res = await fetch(
        `${safeBaseUrl}/api/users/${currentUser._id}/savedEvents/${eventId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setSavedEvents(prev => prev.filter(e => e._id !== eventId));
      }
    } catch (err) {
      console.error("Unsave error:", err);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="profile-page">
      <Bar currentUser={currentUser} />

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

      <div className="profile-tabs">
        <button onClick={() => setActiveTab("events")} className={activeTab==="events"?"active":""}>My Events</button>
        <button onClick={() => setActiveTab("reports")} className={activeTab==="reports"?"active":""}>Reports</button>
        <button onClick={() => setActiveTab("saved")} className={activeTab==="saved"?"active":""}>Saved</button>
      </div>

      <div className="profile-content-area">
        {activeTab === "events" && (
          <div className="card-list">
            {eventsPosted.map(event => (
              <div className="item-card" key={event._id}>
                <div>
                  <h4>{event.title}</h4>
                  <p className="item-date">{new Date(event.start_date).toLocaleString()}</p>
                </div>

                <div className="item-actions">
                  <button onClick={() => requestDeleteEvent(event)}>Delete</button>
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

        {activeTab === "reports" && (
          <div className="card-list">
            {incidentsPosted.map(incident => (
              <div className="item-card" key={incident._id}>
                <div>
                  <h4>{incident.title}</h4>
                  <p className="item-date">{new Date(incident.createdAt).toLocaleString()}</p>
                </div>

                <div className="item-actions">
                  <button onClick={() => requestDeleteIncident(incident)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "saved" && (
          <div className="card-list">
            {savedEvents.map(event => (
              <div className="item-card" key={event._id}>
                <div>
                  <h4>{event.title}</h4>
                  <p className="item-date">{new Date(event.start_date).toLocaleString()}</p>
                </div>

                <div className="item-actions">
                  <button className="unsave-btn" onClick={() => handleUnsaveEvent(event._id)}>
                    Unsave
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

      {/* confirmation popup */}
      {confirmPopup.open && (
        <div className="popup-overlay">
          <div className="popup-message">
            <p>Are you sure you want to delete <strong>{confirmPopup.item?.title}</strong>?</p>
            <p>This action cannot be undone.</p>
            <div className="popup-actions">
              <button className="danger" onClick={confirmDelete}>Delete</button>
              <button onClick={() => setConfirmPopup({ open: false, type: null, item: null })}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="popup-message">
          <span>{popupMessage}</span>
          <button className="popup-close" onClick={() => setShowPopup(false)}>✕</button>
        </div>
      )}
    </div>
  );
}

export default Profile;
