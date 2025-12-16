import { useEffect, useState } from 'react';
import axios from 'axios';
import './incidentContainer.css';
import IncidentList from '../sideList/incidentList.jsx';
import IncidentDetail from '../sideList/incidentDetail.jsx';
import ChatRoom from '../live-chat/chatRoom.jsx';

function IncidentContainer({ currentUser, userLocation, onClose, initialSelectedId, incidents }) {
    const [selectedIncidentId, setSelectedIncidentId] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [previousSelectedIncidentId, setPreviousSelectedIncidentId] = useState(null);

    useEffect(() => {
        if (initialSelectedId) {
            setSelectedIncidentId(initialSelectedId);
        }
    }, [initialSelectedId]);

    const selectedIncident = incidents.find(i => String(i._id) === String(selectedIncidentId));

    // Handle incident selection - reset chat state when selecting a new incident
    const handleIncidentSelect = (evt) => {
        const incidentId = evt?._id || evt;
        
        // Only update if selecting a different incident
        if (incidentId !== selectedIncidentId) {
            setPreviousSelectedIncidentId(selectedIncidentId);
            setSelectedIncidentId(incidentId);
            setShowChat(false); // Always show detail, not chat
        }
    };

    // also reset chat when selectedIncidentId changes to null fior when you closing detail)
    useEffect(() => {
        if (selectedIncidentId === null) {
            setShowChat(false);
        }
    }, [selectedIncidentId]);

    return (
        <div id="incident-container" className="incident-container">
            {/* Left side: Incident List */}
            <div className="incident-list">
                <IncidentList
                    incidents={incidents}
                    userLocation={userLocation}
                    onClose={onClose}
                    onSelect={handleIncidentSelect}
                    currentUser={currentUser}
                />
            </div>

            <hr className="container-divider" />

            {/* Right side: Detail or Chat */}
            <div className="incident-right-section">
                {/* Content: Detail or Chat */}
                {showChat ? (
                    <div className="chat-section">
                        {selectedIncidentId && currentUser ? (
                            <ChatRoom
                                currentUser={currentUser}
                                chatType="incident"
                                chatId={selectedIncidentId}
                                onClose={() => setShowChat(false)} // Close chat, stay on same incident
                                incidentTitle={selectedIncident?.title}
                            />
                        ) : !currentUser ? (
                            <div className="chat-placeholder">
                                <p>Please log in to view the chat room</p>
                            </div>
                        ) : (
                            <div className="chat-placeholder">
                                <p>← Click an incident to view its chat room</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="detail-section">
                        {selectedIncident ? (
                            <IncidentDetail 
                                incident={selectedIncident} 
                                onClose={() => setSelectedIncidentId(null)} 
                                onOpenChat={() => setShowChat(true)}
                                currentUser={currentUser}
                            />
                        ) : (
                            <div className="chat-placeholder">
                                <p>← Click an incident to view details</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default IncidentContainer;
