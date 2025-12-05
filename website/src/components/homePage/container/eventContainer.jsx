import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './eventContainer.css';
import EventList from '../sideList/eventList.jsx';
import ChatRoom from '../live-chat/chatRoom.jsx';
import EventDetail from '../sideList/eventDetail';

function EventContainer({ currentUser, userLocation, onClose, initialSelectedId, events }) {
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [eventOpen, setEventOpen] = useState(null);

    useEffect(() => {
        if (initialSelectedId) {
            const foundEvent = events.find(event => event._id === initialSelectedId);
            if (foundEvent) {
                setEventOpen(foundEvent);
                setSelectedEventId(initialSelectedId);
            }
        }
    }, [initialSelectedId, events]);

    return (
        <div className="event-container">
            {/* Left side: Event List or Event Detail*/}
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
            ):(
                <div className="event-list">
                    <EventList
                        events={events}
                        userLocation={userLocation}
                        onClose={onClose}
                        onSelect={(event) => {
                            setSelectedEventId(event._id);
                            setEventOpen(event);
                        }}                        
                        currentUser={currentUser}
                    />
                </div>
            )}
            
            <hr className="container-divider" />
            <hr className="mobile-divider" />
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
