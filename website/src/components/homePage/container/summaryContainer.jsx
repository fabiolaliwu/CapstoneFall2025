import { useEffect, useState } from 'react';
import axios from 'axios';
import './summaryContainer.css';
import SummaryList from '../sideList/summaryList';
import ChatRoom from '../live-chat/chatRoom.jsx';
import EventDetail from '../sideList/eventDetail.jsx';
import IncidentDetail from '../sideList/incidentDetail.jsx';

function SummaryContainer({ currentUser, userLocation, onClose, initialSelected, events, incidents }) {
    const [selectedItem, setSelectedItem] = useState(null); // { type, _id }
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [showChat, setShowChat] = useState(true); // default to global chat
    const [previousSelectedItem, setPreviousSelectedItem] = useState(null);
    const [ popupMessage, setPopupMessage ] = useState('');

    useEffect(() => {
        if (initialSelected) {
            handleSelect(initialSelected);
        }
    }, [initialSelected]);

    const handleSelect = async (item) => {
        if (selectedItem && item && selectedItem.type === item.type && selectedItem._id === item._id) {
            // If we're in chat view, switch to detail
            if (showChat && selectedDetail) {
                setShowChat(false);
            }
            return;
        }
        
        // If selecting a different item or clearing selection
        setPreviousSelectedItem(selectedItem);
        setSelectedItem(item);
        
        if (!item) {
            setSelectedDetail(null);
            setShowChat(true); // Show global chat when nothing selected
            return;
        }

        // Load detail for selected item
        if (item.type === 'event') {
            const found = events.find(e => String(e._id) === String(item._id));
            if (found) {
                setSelectedDetail(found);
                setShowChat(false); // Show detail, not chat
                return;
            }
            try {
                const resp = await axios.get(`http://localhost:4000/api/events/${item._id}`);
                setSelectedDetail(resp.data);
                setShowChat(false); // Show detail, not chat
                return;
            } catch (err) {
                console.error('Error fetching single event:', err);
                setSelectedDetail(null);
                setShowChat(true); // Fall back to chat
            }
        } else if (item.type === 'incident') {
            const found = incidents.find(i => String(i._id) === String(item._id));
            if (found) {
                setSelectedDetail(found);
                setShowChat(false); // Show detail, not chat
                return;
            }
            try {
                const resp = await axios.get(`http://localhost:4000/api/incidents/${item._id}`);
                setSelectedDetail(resp.data);
                setShowChat(false); // Show detail, not chat
                return;
            } catch (err) {
                console.error('Error fetching single incident:', err);
                setSelectedDetail(null);
                setShowChat(true); // Fall back to global chat
            }
        }
    };

    // Reset chat when item is cleared
    useEffect(() => {
        if (selectedItem === null) {
            setShowChat(true); // Always show global chat when nothing selected
        }
    }, [selectedItem]);

    const handleCloseDetail = () => {
        setSelectedItem(null);
        setSelectedDetail(null);
        setShowChat(true); // Show global chat when closing detail
    };

    const handleOpenChat = () => {
        if (!currentUser) {
            setPopupMessage('Please log in to view the chat room');
            return;
        }
        setShowChat(true);
    };

    return (
        <div>
            <div id="summary-container" className="summary-container">
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

                {/* Right side: Detail or Chat */}
                <div id="global-chat" className="summary-right-section">
                    {showChat ? (
                        <div className="chat-section">
                            {/* Check if user is logged in before showing chat */}
                            {currentUser ? (
                                <ChatRoom
                                    currentUser={currentUser}
                                    chatType={selectedItem ? selectedItem.type : "global"}
                                    chatId={selectedItem ? selectedItem._id : null}
                                    onClose={selectedItem ? () => setShowChat(false) : undefined}
                                    eventTitle={selectedDetail?.title}
                                />
                            ) : (
                                <div className="chat-placeholder">
                                    <p>Please log in to view the chat room</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="detail-section">
                            {selectedDetail && selectedItem ? (
                                selectedItem.type === 'event' ? (
                                    <EventDetail
                                        event={selectedDetail}
                                        onClose={handleCloseDetail}
                                        onOpenChat={handleOpenChat}
                                        currentUser={currentUser}
                                    />
                                ) : (
                                    <IncidentDetail
                                        incident={selectedDetail}
                                        onClose={handleCloseDetail}
                                        onOpenChat={handleOpenChat}
                                        currentUser={currentUser}
                                    />
                                )
                            ) : (
                                <div className="chat-placeholder">
                                    <p>← Click an item to view details</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
            {popupMessage && (
                <div className="popup-overlay" onClick={() => setPopupMessage('')}>
                    <div className="popup-content">
                        <p>{popupMessage}</p>
                        <button onClick={() => setPopupMessage('')}>OK</button>
                    </div>
                </div>
            )}
        </div>

    );
}


export default SummaryContainer;
