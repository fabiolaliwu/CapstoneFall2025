import { useEffect, useState } from 'react';
import axios from 'axios';
import './eventContainer.css';
import EventList from '../sideList/eventList.jsx';
import ChatRoom from '../live-chat/chatRoom.jsx';

function EventContainer({ currentUser, userLocation, onClose }) {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);

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

    return (
        <div className="event-container">
            {/* Left side: Event List */}
            <div className="event-list">
                <EventList
                    events={events}
                    userLocation={userLocation}
                    onClose={onClose}
                    onSelect={setSelectedEventId}
                />
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
