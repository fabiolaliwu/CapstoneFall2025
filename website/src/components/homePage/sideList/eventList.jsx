import { useState, useEffect } from 'react';
import './eventList.css';

function EventList({ events, onClose }) {
    const [userLocation, setUserLocation] = useState(null);
    const [distances, setDistances] = useState({}); // Store distances per event

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
            },
            (error) => console.error('Error getting location:', error)
        );
        }
    }, []);

    // Calculate distances everytime user location or events change
    useEffect(() => {
    if (userLocation) {
        const newDistances = {};
        events.forEach((event) => {
            const coords = event.location?.coordinates;
            if (userLocation && coords?.lat != null && coords?.lng != null) {
            distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                coords.lat,
                coords.lng
            ).toFixed(1);
            }
        console.log('Event ID:', event._id);
        console.log('Event title:', event.title);
        console.log('Event location:', event.location);
        console.log('Event coordinates:', event.location?.coordinates);
        });
        console.log('Calculated distances:', newDistances);
        setDistances(newDistances);
    }
    }, [userLocation, events]);


    // formula to calculate distance between user location and event location
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
    };

    return (
        <div className="event-list-container">
        <button className="close-btn" onClick={onClose}>►</button>
        <div className="event-list">
            <header>EVENTS</header>
            <div className="event-items">
            {events.map((event) => (
                <div key={event._id} className="event-item">
                <div className="distance-bar">
                {distances[event._id] ?? 0} mi
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
            ))}
            </div>
        </div>
        </div>
    );
}

export default EventList;

/* Citation: 
    - referenced how to use axios from https://levelup.gitconnected.com/fetch-api-data-with-axios-and-display-it-in-a-react-app-with-hooks-3f9c8fa89e7b
    - use ChatGPT for help with calculating the distance between locations
*/