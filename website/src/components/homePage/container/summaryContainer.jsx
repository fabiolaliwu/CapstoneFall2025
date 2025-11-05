import { useEffect, useState } from 'react';
import axios from 'axios';
import './summaryContainer.css';
import SummaryList from '../sideList/summaryList.jsx';
import ChatRoom from '../live-chat/chatRoom.jsx';

function SummaryContainer({ currentUser, userLocation, onClose }) {
    const [events, setEvents] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null); // Store both ID and type

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsRes, incidentsRes] = await Promise.all([
                    axios.get('http://localhost:4000/api/events'),
                    axios.get('http://localhost:4000/api/incidents')
                ]);
                setEvents(eventsRes.data);
                setIncidents(incidentsRes.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchData();
    }, []);

    const handleSelectPost = (postId, postType) => {
        setSelectedPost({ id: postId, type: postType });
    };

    return (
        <div className="posts-container">
            {/* Left side: Summary List */}
            <div className="post-list">
                <SummaryList
                    events={events}
                    incidents={incidents}
                    userLocation={userLocation}
                    onClose={onClose}
                    onSelect={handleSelectPost}
                />
            </div>
            <hr className="container-divider" />
            {/* Right side: Chat Room for selected post */}
            <div className="chat-room-container">
                {selectedPost ? (
                    <ChatRoom
                        currentUser={currentUser}
                        chatType={selectedPost.type} // Dynamically set chatType
                        chatId={selectedPost.id}
                        onClose={() => setSelectedPost(null)}
                    />
                ) : (
                    <div className="chat-placeholder">
                        <p>← Click a post to view its chat room</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SummaryContainer;