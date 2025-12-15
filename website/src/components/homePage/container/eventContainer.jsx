import { useEffect, useState } from 'react';
import axios from 'axios';
import './eventContainer.css';
import EventList from '../sideList/eventList.jsx';
import EventDetail from '../sideList/eventDetail.jsx';
import ChatRoom from '../live-chat/chatRoom.jsx';

function EventContainer({ currentUser, userLocation, onClose, initialSelectedId }) {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [previousSelectedEventId, setPreviousSelectedEventId] = useState(null);

    useEffect(() => {
        if (initialSelectedId) {
            setSelectedEventId(initialSelectedId);
        }
    }, [initialSelectedId]);

    useEffect(() => {
        // Fetch all events
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/events');
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    const selectedEvent = events.find(e => String(e._id) === String(selectedEventId));

    // Handle event selection - reset chat state when selecting a new event
    const handleEventSelect = (evt) => {
        const eventId = evt?._id || evt;
        
        // Only update if selecting a different event
        if (eventId !== selectedEventId) {
            setPreviousSelectedEventId(selectedEventId);
            setSelectedEventId(eventId);
            setShowChat(false); // Always show detail, not chat
        }
    };

    // also reset chat when selectedEventId changes to null (when closing detail)
    useEffect(() => {
        if (selectedEventId === null) {
            setShowChat(false);
        }
    }, [selectedEventId]);

    return (
        <div className="event-container">
            {/* Left side: Event List */}
            <div className="event-list">
                <EventList
                    events={events}
                    userLocation={userLocation}
                    onClose={onClose}
                    onSelect={handleEventSelect} // Use the new handler
                    currentUser={currentUser}
                />
            </div>

            <hr className="container-divider" />

            {/* Right side: Detail or Chat */}
            <div className="event-right-section">
                {/* Content: Detail or Chat */}
                {showChat ? (
                    <div className="chat-section">
                        {selectedEventId && currentUser ? (
                            <ChatRoom
                                currentUser={currentUser}
                                chatType="event"
                                chatId={selectedEventId}
                                onClose={() => setShowChat(false)} // Close chat, stay on same event
                                eventTitle={selectedEvent?.title}
                            />
                        ) : !currentUser ? (
                            <div className="chat-placeholder">
                                <p>Please log in to view the chat room</p>
                            </div>
                        ) : (
                            <div className="chat-placeholder">
                                <p>← Click an event to view its chat room</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="detail-section">
                        {selectedEvent ? (
                            <EventDetail 
                                event={selectedEvent} 
                                onClose={() => setSelectedEventId(null)}                       
                                onOpenChat={() => setShowChat(true)}
                                currentUser={currentUser}
                            />
                        ) : (
                            <div className="chat-placeholder">
                                <p>← Click an event to view details</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventContainer;