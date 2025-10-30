import { useState, useEffect } from 'react';
import './eventList.css';

function EventList({ events, onClose, userLocation, onSelect }) {
    const [distances, setDistances] = useState({}); // Store distances per event

    // Calculate distances everytime user location or events change
    useEffect(() => {
    if (userLocation) {
        const newDistances = {};
        events.forEach((event) => {
            const coords = event.location?.coordinates;
            if (userLocation && coords?.lat != null && coords?.lng != null) {
            const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                coords.lat,
                coords.lng
            ).toFixed(1);
            newDistances[event._id] = distance;
            }
        });
        setDistances(newDistances);
    } else{
        setDistances({})
    }
    }, [userLocation, events]);


    // formula to calculate distance between user location and event location in miles
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 3958.8; // radius of earth in miles
        const dLat = ((lat2 - lat1) * Math.PI) / 180; // convert latitudes from degrees to radians
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2; // Haversine formula 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // find central angle, how far apart in radians
        return R * c;
    };

    return (
        <div className="event-list-container">
        {/* <button className="close-btn" onClick={onClose}>►</button> */}
        <div className="event-list">
            <header>EVENTS</header>
            <div className="event-items">
            {events.map((event) => (
                <div 
                    key={event._id} 
                    className="event-item" 
                    onClick={() => onSelect(event._id)}
                >
                    <div className="event-distance-bar"> {distances[event._id] ?? 0} mi </div>  
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
    - use ChatGPT to help with getting user location and calculating the distance between user and event/incident locations
*/