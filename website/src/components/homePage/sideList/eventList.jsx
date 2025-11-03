import { useState, useEffect } from 'react';
import './eventList.css';

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

function EventList({ events, onClose, userLocation, onSelect }) {
    const sortedEvents = [...events].sort((a, b) => {
        const locA = a.location ? a.location.coordinates : null;
        const locB = b.location ? b.location.coordinates : null;

        const distA = calculateDistance(userLocation, locA);
        const distB = calculateDistance(userLocation, locB);

        return distA - distB;
    });

    return (
        <div className="event-list-container">
        {/* <button className="close-btn" onClick={onClose}>►</button> */}
        <div className="event-list">
            <header>EVENTS</header>
            <div className="event-items">
            {sortedEvents.map((event, index) => {
                const eventLocation = event.location ? event.location.coordinates : null;
                const distance = calculateDistance(userLocation, eventLocation);

                return(
                <div 
                    key={event._id} 
                    className="event-item" 
                    onClick={() => onSelect(event._id)}
                >
                    <div className="event-distance-bar"> {distance.toFixed(2)} mi </div>  
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
        </div>
    );
}

export default EventList;

/* Citation: 
    - referenced how to use axios from https://levelup.gitconnected.com/fetch-api-data-with-axios-and-display-it-in-a-react-app-with-hooks-3f9c8fa89e7b
    - used ChatGPT to help with getting user location and calculating the distance between user and incident locations
*/