import './profile.css';
import Bar from '../homePage/bar';
import { useState, useEffect } from 'react';

function Profile({ currentUser }) {
  const [eventsPosted, setEventsPosted] = useState([]);
  const [incidentsPosted, setIncidentsPosted] = useState([]);

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

  return (
    <div className='profile-page'>
      <Bar currentUser={currentUser} />
      <div className='profile-section'>
        <div className='profile-box-background'>
            <div className='header-section'>
                <div className='profile-username'>
                    {currentUser?.username || 'idk why its not working'}
                </div>
            </div>
          

          <div className='profile-boxes'>
            <div className='event-box'>
              <h3>Events Posted ({eventsPosted.length})</h3>
              {eventsPosted.length > 0 ? (
                <ul>
                  {eventsPosted.map(event => (
                    <li key={event._id || event.id}>{event.title}</li>
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
                    <li key={incident._id || incident.id}>{incident.title}</li>
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
