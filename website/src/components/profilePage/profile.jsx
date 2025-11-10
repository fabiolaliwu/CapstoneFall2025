import './profile.css';
import Bar from '../homePage/bar';
import { useState, useEffect } from 'react';

const AVATARS =[
  'avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png',
  'avatar5.png', 'avatar6.png', 'avatar7.png', 'avatar8.png',
]

function Profile({ currentUser }) {
  const [eventsPosted, setEventsPosted] = useState([]);
  const [incidentsPosted, setIncidentsPosted] = useState([]);
  const [selectEvent, setSelectEvent] = useState(null);
  const [selectIncident, setSelectIncident] = useState(null);

  // Avatr selection handling and update to DB
  const [showAvatarList, setShowAvatarList] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar || 'avatar8.png');

  const handleAvatar = async (avatar) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/users/${currentUser._id}/avatar`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar }),
        }
      );
      if (response.ok) {
        setSelectedAvatar(avatar);
        setShowAvatarList(false);
        currentUser.avatar = avatar;
        alert('Avatar updated successfully!');
        console.log('Avatar updated:', avatar);
      } else {
        console.error('Failed to update avatar');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };
  // get current user avatar
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!currentUser?._id) return;
      try {
        const res = await fetch(`http://localhost:4000/api/users/${currentUser._id}`);
        if (!res.ok) 
          throw new Error('Failed to fetch user');
        const data = await res.json();
        setSelectedAvatar(data.avatar || 'avatar8.png');
      } catch (err) {
        console.error(err);
      }
    };
    fetchCurrentUser();
  }, [currentUser?._id]);

  // fetch data once currentUser is available
  useEffect(() => {
    if (!currentUser || !currentUser._id) return;

    const fetchUserData = async () => {
      try {

        // fetch events created by this user
        const eventsResponse = await fetch(`http://localhost:4000/api/events/user/${currentUser._id}`);
        const incidentsResponse = await fetch(`http://localhost:4000/api/incidents/user/${currentUser._id}`);

        if (!eventsResponse.ok || !incidentsResponse.ok) {
          throw new Error('Failed to fetch user posts');
        }

        const eventsData = await eventsResponse.json();
        const incidentsData = await incidentsResponse.json();

        setEventsPosted(eventsData || []);
        setIncidentsPosted(incidentsData || []);
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Delete event/incident handlers
  const handleDeleteEvent = async (event) => {
    const confirmDelete = window.confirm(`Delete event ${event.title}? This action cannot be undo.`);
    if (!confirmDelete) return;
    try {
      const response = await fetch(`http://localhost:4000/api/events/${event._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEventsPosted(prev => prev.filter(e => e._id !== event._id));
        alert(`Event "${event.title}" deleted successfully!`);
      }else{
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  }
  const handleDeleteIncident = async (incident) => {
    const confirmDelete = window.confirm(`Delete incident ${incident.title}? This action cannot be undo.`);
    if (!confirmDelete) return;
    try {
      const response = await fetch(`http://localhost:4000/api/incidents/${incident._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setIncidentsPosted(prev => prev.filter(i => i._id !== incident._id));
        alert(`Incident "${incident.title}" deleted successfully!`);
      }else {
        console.error('Failed to delete incident');
      }
    } catch (error) {
      console.error('Error deleting incident:', error);
    }
  }

  return (
    <div className='profile-page'>
      <Bar currentUser={currentUser} />
      <div className='profile-section'>
        <div className='profile-box-background'>

          {/* Header section with avatar and username */}
          <div className='header-section'>
            {currentUser && (
              <img
                src={`http://localhost:4000/avatars/${selectedAvatar}?t=${Date.now()}`}
                onClick={() => setShowAvatarList(!showAvatarList)}
                alt="User Avatar"
                className="avatar"
              />
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className='profile-username' style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {currentUser?.username || 'idk why its not working'}
              </div>
            </div>
          </div>

          {/* Avatar list when triggered */}
          {showAvatarList && (
            <div className='avatar-selection'>
              <div className='avatars-map'>
                {AVATARS.map(avatar => (
                  <img
                    key={avatar}
                    src={`http://localhost:4000/avatars/${avatar}`}
                    alt={avatar}
                    className="avatar-option"
                    onClick={() => setSelectedAvatar(avatar)}
                  />
                ))}
              </div>
              {selectedAvatar === 'avatar8.png' && <p>You're still a potato 🥔. Choose any avatar you like!</p>}
              {/* Button to update avatar */}
              <button 
                className="avatar-button"
                onClick={() => handleAvatar(selectedAvatar)}
              >Save selection
              </button>
            </div>
          )}
          

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
                          <div>
                            <button 
                              className="delete-button" 
                              onClick={() => handleDeleteEvent(event)}
                            > Delete</button>
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
                            <button className="delete-button" onClick={() => handleDeleteIncident(incident)}>Delete</button>
                          </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No incidents reported yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
