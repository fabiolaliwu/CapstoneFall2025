import { useEffect, useState } from 'react';
import axios from 'axios';
import './incidentContainer.css';
import IncidentList from '../sideList/incidentList.jsx';
import IncidentDetail from '../sideList/incidentDetail.jsx';
import ChatRoom from '../live-chat/chatRoom.jsx';

function IncidentContainer({ currentUser, userLocation, onClose, initialSelectedId }) {
    const [incidents, setIncidents] = useState([]);
    const [selectedIncidentId, setSelectedIncidentId] = useState(null);

    useEffect(() => {
        if (initialSelectedId) {
            setSelectedIncidentId(initialSelectedId);
        }
    }, [initialSelectedId]);

    useEffect(() => {
        // Fetch all incidents
        const fetchIncidents = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/incidents');
                setIncidents(response.data);
            } catch (error) {
                console.error('Error fetching incidents:', error);
            }
        };
        fetchIncidents();
    }, []);

    const selectedIncident = incidents.find(i => String(i._id) === String(selectedIncidentId));

    return (
        <div className="incident-container">
            {/* Left side: Incident List */}
            <div className="incident-list">
                <IncidentList
                    incidents={incidents}
                    userLocation={userLocation}
                    onClose={onClose}
                    onSelect={(inc) => setSelectedIncidentId(inc?._id || inc)}
                    currentUser={currentUser}
                />
            </div>

            <hr className="container-divider" />

            {/* Middle: Detail panel */}
            <div className="incident-detail-panel">
                {selectedIncident ? (
                    <IncidentDetail incident={selectedIncident} onClose={() => setSelectedIncidentId(null)} />
                ) : (
                    <div className="chat-placeholder">
                        <p>← Click an incident to view details</p>
                    </div>
                )}
            </div>

            <hr className="container-divider" />

            {/* Right side: Chat Room for selected incident */}
            <div className="chat-room-container">
                {selectedIncidentId ? (
                    <ChatRoom
                        currentUser={currentUser}
                        chatType="incident"
                        chatId={selectedIncidentId}
                        onClose={() => setSelectedIncidentId(null)}
                    />
                ) : (
                    <div className="chat-placeholder">
                        <p>← Click an incident to view its chat room</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default IncidentContainer;
