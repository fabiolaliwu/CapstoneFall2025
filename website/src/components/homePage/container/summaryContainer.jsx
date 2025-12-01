import { useEffect, useState } from 'react';
import axios from 'axios';
import './summaryContainer.css';
import SummaryList from '../sideList/summaryList';
import ChatRoom from '../live-chat/chatRoom.jsx';
import EventDetail from '../sideList/eventDetail';
import IncidentDetail from '../sideList/incidentDetail.jsx';

function SummaryContainer({currentUser, userLocation, onClose, initialSelectedId, events, incidents }) {
    const [eventOpen, setEventOpen] = useState(null);
    const [incidentOpen, setIncidentOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedIncidentId, setSelectedIncidentId] = useState(null);

    useEffect(() => {
        if (initialSelectedId) {
            const foundEvent = events.find(event => event._id === initialSelectedId);
            if (foundEvent) {
                setEventOpen(foundEvent);
                setSelectedEventId(initialSelectedId);
            } else {
                const foundIncident = incidents.find(incident => incident._id === initialSelectedId);
                if (foundIncident) {
                    setIncidentOpen(foundIncident);
                    setSelectedIncidentId(initialSelectedId);
                }
            }
        }
    }, [initialSelectedId, events, incidents]);

    return (
        <div className="summary-container">
            {/* Left side list */}
            {eventOpen ? (
                <div className="event-detail">
                    <EventDetail
                        event={eventOpen}
                        onClose={() => {
                            setEventOpen(null);
                            setSelectedEventId(null);
                        }}
                    />
                </div>
                ) : incidentOpen ? (
                    <div className="incident-detail">
                        <IncidentDetail
                            incident={incidentOpen}
                            onClose={() => {
                                setIncidentOpen(null);
                                setSelectedIncidentId(null);
                            }}
                        />
                    </div>
                ) : (
                    <div className="summary-list">
                    <SummaryList
                        events={events}
                        incidents={incidents}
                        userLocation={userLocation}
                        onClose={onClose}
                        onSelectEvents={(event) => {
                            setSelectedEventId(event._id);
                            setEventOpen(event);
                        }}     
                        onSelectIncident={(incident) => {
                            setSelectedIncidentId(incident._id);
                            setIncidentOpen(incident);
                        }}                   
                        currentUser={currentUser}
                    />
                </div>
            )}

            <hr className="container-divider" />

            {/* Right side chat */}
            <div className="chat-room-container">
                <ChatRoom
                    currentUser={currentUser}
                    chatType="global"
                    chatId="main"
                />
            </div>
        </div>
    );
}

export default SummaryContainer;

