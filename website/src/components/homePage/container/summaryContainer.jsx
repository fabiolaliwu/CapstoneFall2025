import { useEffect, useState } from 'react';
import axios from 'axios';
import './summaryContainer.css';
import SummaryList from '../sideList/summaryList';
import ChatRoom from '../live-chat/chatRoom.jsx';
import EventDetail from '../sideList/eventDetail.jsx';
import IncidentDetail from '../sideList/incidentDetail.jsx';

function SummaryContainer({ currentUser, userLocation, onClose, initialSelected }) {
    const [incidents, setIncidents] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); // { type, id }

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

    const [selectedDetail, setSelectedDetail] = useState(null);

    const handleSelect = async (item) => {
        setSelectedItem(item);
        if (!item) {
            setSelectedDetail(null);
            return;
        }

        // Try to find locally first using _id
        if (item.type === 'event') {
            const found = events.find(e => String(e._id) === String(item._id));
            if (found) {
                console.log('Found event locally:', found);
                setSelectedDetail(found);
                return;
            }
            // fetch single event as fallback
            try {
                const resp = await axios.get(`http://localhost:4000/api/events/${item._id}`);
                console.log('Fetched event:', resp.data);
                setSelectedDetail(resp.data);
                return;
            } catch (err) {
                console.error('Error fetching single event:', err);
                setSelectedDetail(null);
                return;
            }
        } else if (item.type === 'incident') {
            const found = incidents.find(i => String(i._id) === String(item._id));
            if (found) {
                console.log('Found incident locally:', found);
                setSelectedDetail(found);
                return;
            }
            try {
                const resp = await axios.get(`http://localhost:4000/api/incidents/${item._id}`);
                console.log('Fetched incident:', resp.data);
                setSelectedDetail(resp.data);
                return;
            } catch (err) {
                console.error('Error fetching single incident:', err);
                setSelectedDetail(null);
                return;
            }
        }
        setSelectedDetail(null);
    };

    return (
        <div className="summary-container">
            {/* Left side list */}
            <div className="summary-list">
                <SummaryList
                    incidents={incidents}
                    events={events}
                    userLocation={userLocation}
                    onSelectEvents={handleSelect}
                    onSelectIncident={handleSelect}
                    onClose={onClose}
                    currentUser={currentUser}
                />
            </div>

            <hr className="container-divider" />

            {/* Middle: Detail panel */}
            <div className="summary-detail-panel">
                {selectedDetail && selectedItem ? (
                    selectedItem.type === 'event' ? (
                        <EventDetail event={selectedDetail} onClose={() => { setSelectedItem(null); setSelectedDetail(null); }} />
                    ) : (
                        <IncidentDetail incident={selectedDetail} onClose={() => { setSelectedItem(null); setSelectedDetail(null); }} />
                    )
                ) : (
                    <div className="chat-placeholder">
                        <p>← Click an item to view details</p>
                    </div>
                )}
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

