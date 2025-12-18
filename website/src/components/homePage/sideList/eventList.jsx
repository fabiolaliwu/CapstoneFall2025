import { useState, useEffect } from 'react';
import './eventList.css';
import { FaHeart } from 'react-icons/fa';
import { BiSolidUpvote } from "react-icons/bi";
import { useEventUpvotes } from './useUpvote';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const safeBaseUrl = API_BASE_URL.replace(/\/$/, '');

const calculateDistance = (loc1, loc2) => {
    if (!loc1 || !loc2) return Infinity; 

    const toRad = (degree) => degree * (Math.PI / 180);

    const R = 3958.8;
    const dLat = toRad(loc2.lat - loc1.lat);
    const dLon = toRad(loc2.lng - loc1.lng);
    
    const lat1Rad = toRad(loc1.lat);
    const lat2Rad = toRad(loc2.lat);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 

    return distance;
};

function EventList({ events, onClose, userLocation, onSelect, currentUser }) {
    const sortedEvents = [...events].sort((a, b) => {
        const locA = a.location ? a.location.coordinates : null;
        const locB = b.location ? b.location.coordinates : null;

        const distA = calculateDistance(userLocation, locA);
        const distB = calculateDistance(userLocation, locB);

        return distA - distB;
    });
    const {
        upvotedEvents,
        eventUpvoteCounts,
        upvotingEventId,
        toggleUpvote
    } = useEventUpvotes(events, currentUser, safeBaseUrl);

  const [savedEvents, setSavedEvents] = useState([]);
  const [savingEventId, setSavingEventId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const showAuthPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000);
  };

  const handleSaveEvent = async (event) => {
    if (!currentUser?._id) {
      showAuthPopup('To save events, create an account!');
      return;
    }

    if (savingEventId) return;

    const eventId = String(event._id);
    const wasSaved = savedEvents.includes(eventId);
    
    setSavingEventId(eventId);
    // Update icon color before getting server response
    setSavedEvents(prev => wasSaved
      ? prev.filter(id => id !== eventId)
      : [...prev, eventId]
    );

    try {
      const response = await fetch(
        `${safeBaseUrl}/api/users/${currentUser._id}/savedEvents`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId: event._id }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to save/unsave event');
      }else{  // Allow toggling between saved and unsaved event 

        setPopupMessage(
          wasSaved ? 'Event unsaved successfully!' : 'Event saved successfully!'
        );
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 5000);

      }
    } catch (error) {
      console.error('Error saving/unsaving event:', error);
    } finally {
      setSavingEventId(null);
    }
  }

  useEffect(() => {
    const fetchSavedEvents = async () => {
      if (!currentUser?._id) return;
      try {
        const response = await fetch(
          `${safeBaseUrl}/api/users/${currentUser._id}/savedEvents`
        );
        if (response.ok) {
          const userData = await response.json();
          console.log('Full user data with savedEvents:', userData);
          if (Array.isArray(userData)) {
            const savedIds = userData.map(item => String(item._id || item));
            setSavedEvents(savedIds);
          } else {
            setSavedEvents([]);
          }
          
        } else {
          console.log('Failed to fetch user data, status:', response.status);
          setSavedEvents([]);
        }
      } catch (error) {
        console.error('Error fetching saved events:', error);
      }
    };
    fetchSavedEvents();
  }, [currentUser]);
  
    return (
        <div className="event-list-container">
        <div className="event-list">
            <header>EVENTS</header>
            <div className="event-items">
            {sortedEvents.map((event, index) => {
                const eventLocation = event.location ? event.location.coordinates : null;
                const distance = calculateDistance(userLocation, eventLocation);
                const isEventSaved = savedEvents.includes(String(event._id));
                const eventId = String(event._id);
                const isUpvoted = upvotedEvents.has(eventId);
                const upvoteCount = eventUpvoteCounts[eventId] || 0;

                return(
                <div 
                    key={event._id} 
                    className="event-item" 
                    onClick={() => onSelect(event)}
                    id={index === 0 ? "event-list-item" : undefined}
                >
                    <div className="distance-heart-container">
                        <div className="event-distance-bar"> {distance.toFixed(2)} mi </div>  
                        <div className="icon-group">
                          <div className="upvote-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!currentUser?._id) {
                                showAuthPopup('To upvote, create an account!');
                                return;
                              }
                              toggleUpvote(event);
                            }}

                          >   
                            {upvoteCount > 0 &&( <span className="upvote-count">{upvoteCount}</span>)}
                            <BiSolidUpvote 
                                size={20} 
                                color={isUpvoted ? '#ed623b' : "grey"} 
                            />
                          </div>
                          <div
                            className="save-event-icon" 
                            onClick={(e) => {
                                e.stopPropagation(); 
                                handleSaveEvent(event);
                          }}>
                            <FaHeart color={savedEvents.includes(String(event._id)) ? '#f03e82' : 'grey'} />
                              {savingEventId === String(event._id) && '...'} 
                          </div>
                        </div>
                    </div>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <span>
                        Start Date:{' '}
                        {new Date(event.start_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        })}
                    </span>
                    <br />
                    <span>
                        End Date:{' '}
                        {event.end_date
                        ? new Date(event.end_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            })
                        : 'None'}
                    </span>
                </div>
                );
            })}
            </div>
        </div>
        {showPopup && (
          <div className="popup-message">
              <span>{popupMessage}</span>
              <button
                className="popup-close"
                onClick={() => setShowPopup(false)}
              >
                ✕
              </button>
          </div>
        )}
      </div>
    );
}

export default EventList;

/* Citation: 
    - referenced how to use axios from https://levelup.gitconnected.com/fetch-api-data-with-axios-and-display-it-in-a-react-app-with-hooks-3f9c8fa89e7b
    - used ChatGPT to help with getting user location and calculating the distance between user and incident locations
*/