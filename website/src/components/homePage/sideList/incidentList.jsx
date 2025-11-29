import './incidentList.css';
import { BiSolidUpvote } from "react-icons/bi";
import { useIncidentUpvotes } from './useUpvote';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const safeBaseUrl = API_BASE_URL.replace(/\/$/, '');

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

// Train color for each line
const trainColors = {
    '1': '#D82233','2': '#D82233','3': '#D82233','4': '#009952','5': '#009952',
    '6': '#009952','7': '#9A38A1','A': '#0062CF','B': '#EB6800','C': '#0062CF',
    'D': '#EB6800','E': '#EB6800','F': '#EB6800','G': '#6CBE45','J': '#8E5C33',
    'L': '#AAAAAA','M': '#EB6800','N': '#F6BC26','Q': '#F6BC26','R': '#F6BC26',
    'S': '#808080','W': '#F6BC26','Z': '#8E5C33'
  };
  

function IncidentList({ incidents, onClose, userLocation, onSelect, currentUser }) {
    const sortedIncidents = [...incidents].sort((a, b) => {
        const locA = a.location ? a.location.coordinates : null;
        const locB = b.location ? b.location.coordinates : null;

        const distA = calculateDistance(userLocation, locA);
        const distB = calculateDistance(userLocation, locB);
        return distA - distB;
    });
    const {
        upvotedIncidents,
        incidentUpvoteCounts,
        upvotingIncidentId,
        toggleUpvote
    } = useIncidentUpvotes(incidents, currentUser, safeBaseUrl);

    return (
        <div className="incident-list-container">
            <div className="incident-list">
                <header>INCIDENTS</header>
                <div className="incident-items">
                    {sortedIncidents.map((incident) => {
                        const incidentLocation = incident.location ? incident.location.coordinates : null;
                        const distance = calculateDistance(userLocation, incidentLocation);
                        const incidentId = String(incident._id);
                        const isUpvoted = upvotedIncidents.has(incidentId);
                        const upvoteCount = incidentUpvoteCounts[incidentId] || 0;

                        return (
                            <div
                                key={incident._id}
                                className="incident-item"
                                onClick={() => onSelect(incident)}
                            >
                                <div className="icon">  
                                    <div className="left-icon">
                                        <div className="incident-distance-bar">
                                            {distance.toFixed(2)} mi
                                        </div>
                                        {incident.train_line && !(incident.train_line.length === 1 && incident.train_line[0] === "N/A") && (
                                            <div className="train-lines">
                                            {incident.train_line.map((line) => (
                                                <span
                                                key={line}
                                                style={{
                                                    backgroundColor: trainColors[line] || '#000000',
                                                    color: (line === 'N' || line === 'R' ||  line === 'Q' ||  line === 'W') ? '#000000' : '#FFFFFF' 
                                                }}
                                                >
                                                {line}
                                                </span>
                                            ))}
                                            </div>
                                        )}
                                    </div>
                                        
                                    <div className="upvote-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleUpvote(incident); 
                                        }}
                                    >   
                                        {upvoteCount > 0 &&(
                                            <span className="upvote-count">{upvoteCount}</span>
                                        )}
                                        <BiSolidUpvote 
                                            size={20} 
                                            color={isUpvoted ? '#ed623b' : "grey"} 
                                        />
                                        
                                    </div>
                                </div>
                                <h3>{incident.title}</h3>
                                <p>{incident.description}</p>
                                <span>
                                    Time Occurred: {new Date(incident.createdAt).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                                </span>
                                <br />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default IncidentList;

/* Citation: 
    - referenced how to use axios from https://levelup.gitconnected.com/fetch-api-data-with-axios-and-display-it-in-a-react-app-with-hooks-3f9c8fa89e7b
    - used ChatGPT to help with getting user location and calculating the distance between user and incident locations
*/
