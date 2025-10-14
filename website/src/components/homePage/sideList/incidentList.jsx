import { useState, useEffect } from 'react';
import './incidentList.css';

function IncidentList({ incidents, onClose }) {
    const [userLocation, setUserLocation] = useState(null);
    const [distances, setDistances] = useState({}); // Store distances per incident

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

    // Calculate distances whenever user location or incidents change
    useEffect(() => {
        if (userLocation) {
        const newDistances = {};
        incidents.forEach((incident) => {
            const coords = incident.location?.coordinates;
            if (coords?.lat != null && coords?.lng != null) {
            const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                coords.lat,
                coords.lng
            ).toFixed(1);
            }
        });
        setDistances(newDistances);
        }
    }, [userLocation, incidents]);


    // formula to calculate distance between user location and incident location
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
        <div className="incident-list-container">
        <button className="close-btn" onClick={onClose}>►</button>
        <div className="incident-list">
            <header>INCIDENTS</header>
            <div className="incident-items">
            {incidents.map((incident) => (
                <div key={incident._id} className="incident-item">
                {(
                    <div className="distance-bar">{distances[incident._id] ?? 0} mi</div>
                )}
                <h3>{incident.title}</h3>
                <p>{incident.description}</p>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
}

export default IncidentList;

/* Citation: 
    - referenced how to use axios from https://levelup.gitconnected.com/fetch-api-data-with-axios-and-display-it-in-a-react-app-with-hooks-3f9c8fa89e7b
    - use ChatGPT for help with calculating the distance between locations 
*/