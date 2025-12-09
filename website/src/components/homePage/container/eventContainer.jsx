import { useEffect, useState } from 'react';
import axios from 'axios';
import './eventContainer.css';
import EventList from '../sideList/eventList.jsx';
import EventDetail from '../sideList/eventDetail.jsx';
import ChatRoom from '../live-chat/chatRoom.jsx';

function EventContainer({ currentUser, userLocation, onClose, initialSelectedId }) {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);

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

    return (
        <div className="event-container">
            {/* Left side: Event List */}
            <div className="event-list">
                <EventList
                    events={events}
                    userLocation={userLocation}
                    onClose={onClose}
                    onSelect={(evt) => setSelectedEventId(evt?._id || evt)}
                    currentUser={currentUser}
                />
            </div>

            <hr className="container-divider" />

            {/* Middle: Detail panel */}
            <div className="event-detail-panel">
                {selectedEvent ? (
                    <EventDetail event={selectedEvent} onClose={() => setSelectedEventId(null)} />
                ) : (
                    <div className="chat-placeholder">
                        <p>← Click an event to view details</p>
                    </div>
                )}
            </div>

            <hr className="container-divider" />

            {/* Right side: Chat Room for selected event */}
            <div className="chat-room-container">
                {selectedEventId ? (
                    <ChatRoom
                        currentUser={currentUser}
                        chatType="event"
                        chatId={selectedEventId}
                        onClose={() => setSelectedEventId(null)}
                    />
                ) : (
                    <div className="chat-placeholder">
                        <p>← Click an event to view its chat room</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventContainer;
