import { useEffect, useState } from 'react';
import axios from 'axios';
import './summaryContainer.css';
import SummaryList from '../sideList/summaryList';
import ChatRoom from '../live-chat/chatRoom.jsx';

function SummaryContainer({currentUser, userLocation, onClose}) {
        const [incidents, setIncidents] = useState([]);
        const [events, setEvents] = useState([]);

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
                    onClose={onClose}
                    currentUser={currentUser}
                />
            </div>

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

