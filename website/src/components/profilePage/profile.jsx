import './profile.css';
import Bar from '../homePage/bar';
import { useState, useEffect } from 'react';
import Modal from './modal';
import Avatar from './Avatar.jsx';

function Profile({ currentUser }) {
  const [eventsPosted, setEventsPosted] = useState([]);
  const [incidentsPosted, setIncidentsPosted] = useState([]);
  const [selectEvent, setSelectEvent] = useState(null);
  const [selectIncident, setSelectIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedEvents, setSavedEvents] = useState([]);
  const [showModal, setShowModal] = useState(false); // Pop up model for editing event
  const [eventToEdit, setEventToEdit] = useState(null); 

  // Format date to date and time format
  const formatForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  // fetch data once currentUser is available
  useEffect(() => {
    if (!currentUser || !currentUser._id) return;

    const fetchUserData = async () => {
      try {

        // fetch events created by this user
        const [eventsResponse, incidentsResponse, savedEventsResponse] = await Promise.all([
          fetch(`http://localhost:4000/api/events/user/${currentUser._id}`),
          fetch(`http://localhost:4000/api/incidents/user/${currentUser._id}`),
          fetch(`http://localhost:4000/api/users/${currentUser._id}/savedEvents`),
        ]);

        if (!eventsResponse.ok || !incidentsResponse.ok || !savedEventsResponse.ok) {
          throw new Error('Failed to fetch user posts');
        }

        const eventsData = await eventsResponse.json();
        const incidentsData = await incidentsResponse.json();
        const savedEventsData = await savedEventsResponse.json();

        setEventsPosted(eventsData || []);
        setIncidentsPosted(incidentsData || []);
        setSavedEvents(savedEventsData || []);
        
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // event and incident handlers
  const handleEvent = async (event, action) => {
    if (action === "delete") {
      const confirmDelete = window.confirm(`Delete event ${event.title}? This action cannot be undone.`);
      if (!confirmDelete) return;
  
      try {
        const response = await fetch(`http://localhost:4000/api/events/${event._id}`, {
          method: "DELETE",
        });
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
    if(action === "delete") {
      const confirmDelete = window.confirm(`Delete incident ${incident.title}? This action cannot be undone.`);
      if (!confirmDelete) return;

      try {
        const response = await fetch(`http://localhost:4000/api/incidents/${incident._id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setIncidentsPosted(prev => prev.filter(i => i._id !== incident._id));
          alert(`Incident "${incident.title}" deleted successfully!`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div className='profile-page'>
      <Bar currentUser={currentUser} />
      <div className='profile-section'>
        <div className='profile-box-background'>

          {/* Header section with avatar and username */}
          <div className='header-section'>
            <Avatar currentUser={currentUser} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className='profile-username' style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {currentUser?.username || 'Unknown User'}
              </div>
            </div>
          </div>

          <br></br>
          <div className='profile-boxes'>
            <div className='event-box'>
              <h3>Events Posted ({eventsPosted.length})</h3>
              {eventsPosted.length > 0 ? (
                <ul>
                  {eventsPosted.map(event => (
                    <li key={event._id || event.id}>
                      <span
                        className="title"
                        onClick={() => setSelectEvent(selectEvent === event._id ? null : event._id)}
                      >{event.title}</span>
                      
                      {/* Click title to delete or update event */}
                      {selectEvent === event._id && (
                        <div className="triggered-button">
                          <button className="delete-button" onClick={() => handleEvent(event, "delete")}>Delete</button>
                          <button
                            className="update-button"
                            onClick={() => {
                              setEventToEdit({
                                ...event,
                                start_date: formatForInput(event.start_date),
                                end_date: formatForInput(event.end_date)
                              });
                              setShowModal(true);
                            }}
                            >Edit</button>

                          </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No events posted yet.</p>
              )}
            </div>

            <div className='incident-box'>
              <h3>Incidents Reported ({incidentsPosted.length})</h3>
              {incidentsPosted.length > 0 ? (
                <ul>
                  {incidentsPosted.map(incident => (
                    <li key={incident._id || incident.id}>
                      <span
                        className="title"
                        onClick={() => setSelectIncident(selectIncident === incident._id ? null : incident._id)}
                      >{incident.title}</span>
                      {/* Click title to delete or update incident */}
                      {selectIncident === incident._id && (
                          <div>
                            <button className="delete-button" onClick={() => handleIncident(incident, "delete")}>Delete</button>                          </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No incidents reported yet.</p>
              )}
            </div>

            {/* Saved Event List */}
            <div className='saved-event-box'>
              <h3>Saved Events ({savedEvents.length})</h3>
              {savedEvents.length > 0 ? (
                <ul>
                  {savedEvents.map(event => (
                    <li key={event._id || event.id}>
                      <span className="title">{event.title}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No saved events yet.</p>
              )}
            </div>
          </div>
          {/* Pop up window for editing events */}
          {showModal && (
            <Modal
              eventData={eventToEdit}
              onClose={() => setShowModal(false)}
              onSave={(updatedEvent) => {
                setEventsPosted(prev =>
                  prev.map(e => (e._id === updatedEvent._id ? updatedEvent : e))
                );
                setShowModal(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  ); 
}

export default Profile;
