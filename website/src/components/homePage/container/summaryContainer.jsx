import { useEffect, useState } from 'react';
import axios from 'axios';
import './summaryContainer.css';
import SummaryList from '../sideList/summaryList';
import ChatRoom from '../live-chat/chatRoom.jsx';

function SummaryContainer({currentUser, userLocation, onClose, initialSelected}) {
        const [incidents, setIncidents] = useState([]);
        const [events, setEvents] = useState([]);
        const [selectedItem, setSelectedItem] = useState(null);

        useEffect(() => {
            if (initialSelected) {
                setSelectedItem(initialSelected);
            }
        }, [initialSelected]);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const [incidentsResponse, eventResponse] = await Promise.all([
                        axios.get('http://localhost:4000/api/incidents'),
                        axios.get('http://localhost:4000/api/events'),
                    ]);

                    setIncidents(incidentsResponse.data);
                    setEvents(eventResponse.data);
                } catch (error) {
                    console.error('Error fetching the summary data:', error);
                }
            };
            
            fetchData();
        }, []);

        return (
            <div className="summary-container">
            {/* Left side list */}
            <div className="summary-list">
                <SummaryList
                    incidents={incidents}
                    events={events}
                    userLocation={userLocation}
                    onSelect={setSelectedItem}
                    onClose={onClose}
                    currentUser={currentUser}
                />
            </div>

            <hr className="container-divider" />

            {/* Right side chat */}
            <div className="chat-room-container">
                {selectedItem ? (
                    <ChatRoom
                        currentUser={currentUser}
                        chatType={selectedItem.type}
                        chatId={selectedItem.id}
                        onClose={() => setSelectedItem(null)}
                    />
                ) : (
                    <div className="chat-placeholder">
                        <p>← Click an item to view its chat room</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SummaryContainer;

