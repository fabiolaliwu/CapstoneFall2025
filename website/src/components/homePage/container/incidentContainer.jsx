import { useEffect, useState } from 'react';
import axios from 'axios';
import './incidentContainer.css';
import IncidentList from '../sideList/incidentList.jsx';
import ChatRoom from '../live-chat/chatRoom.jsx';
import IncidentDetail from '../sideList/incidentDetail.jsx';

function IncidentContainer({ currentUser, userLocation, onClose, initialSelectedId, incidents }) {
    const [selectedIncidentId, setSelectedIncidentId] = useState(null);
    const [incidentOpen, setIncidentOpen] = useState(false);

    useEffect(() => {
        if (initialSelectedId) {
            const foundIncident = incidents.find(incident => incident._id === initialSelectedId);
            if (foundIncident) {
                setIncidentOpen(foundIncident);
                setSelectedIncidentId(initialSelectedId);
            }
        }
    }, [initialSelectedId, incidents]);

    return (
        <div className="incident-container">
            {/* Left side: Incident List */}
            {incidentOpen ? (
                <div className="incident-detail">
                    <IncidentDetail
                        incident={incidentOpen}
                        onClose={() => {
                            setIncidentOpen(null);
                            setSelectedIncidentId(null);
                        }}
                    />
                </div>
            ):(
                <div className="incident-list">
                    <IncidentList
                        incidents={incidents}
                        userLocation={userLocation}
                        onClose={onClose}
                        onSelect={(incident) => {
                            setSelectedIncidentId(incident._id);
                            setIncidentOpen(incident);
                        }}                        
                        currentUser={currentUser}
                    />
                </div>
            )}
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
