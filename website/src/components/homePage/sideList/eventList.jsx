import React from 'react';
import './eventList.css';

function EventList({ events, onClose }) {
    return (
        <div className="event-list">
            <button onClick={onClose}>→</button>
            {events.map(event => (
                <div key={event._id} className="event-item">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
            ))}
        </div>
    );
}

export default EventList;