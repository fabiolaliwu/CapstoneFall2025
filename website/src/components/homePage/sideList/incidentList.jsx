import React from 'react';
import './incidentList.css';

function IncidentList({ incidents, onClose }) {
    return (
        <div className="incident-list">
            <button onClick={onClose}>→</button>
            {incidents.map(incident => (
                <div key={incident._id} className="incident-item">
                    <h3>{incident.title}</h3>
                    <p>{incident.description}</p>
                    <span>{new Date(incident.date).toLocaleDateString()}</span>
                </div>
            ))}
        </div>
    );
}

export default IncidentList;