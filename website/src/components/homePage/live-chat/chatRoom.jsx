import { useEffect, useState } from "react";
import io from "socket.io-client";
import './chatRoom.css';
import axios from "axios";

const socket = io("http://localhost:4000");

function ChatRoom({ currentUser, chatType = "global", chatId = null, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    
    const getSenderId = (user) => user?.uuid || user?._id || user;
    // Get username from sender
    const getUsername = (sender) => {
        if (!sender) return "Unknown";
        return sender.username || "Unknown";
    };

    // Determine room
    const room = chatType === "global" ? "global" : `${chatType}-${chatId}`;

    // fetch chat title for selected event/incident
    const [chatTitle, setChatTitle] = useState(
        chatType === "global" ? "Global Chat" : `${chatType.charAt(0).toUpperCase() + chatType.slice(1)} Chat`
    );

    // pull previous chat messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/messages?chat_type=${chatType}&ref_id=${chatId}`);

                if (chatType !== "global" && chatId) {
                    const resTitle = await axios.get(`http://localhost:4000/api/${chatType}s/${chatId}`);
                    setChatTitle(resTitle.data.title || `${chatType} Chat`);
                }
                // if the event/incident has no message yet
                if (response.data.length === 0 && chatType !== 'global') {
                    const initMessage = {
                        text: `${chatType} chat started.`,
                        sender: getSenderId(currentUser),
                        chat_type: chatType,
                        ref_id: chatId,
                        createdAt: new Date().toISOString(),
                    };
                    await axios.post('http://localhost:4000/api/messages', initMessage);
                    setMessages([initMessage]);
                } else {
                    setMessages(response.data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setLoading(false);
            }
        };
        if(chatType === "global" || chatId){
            fetchMessages();
        }
    },[chatType, chatId, currentUser]);

    // Setup socket listeners
    useEffect(() => {
        socket.emit('joinRoom', room);

        const handleNewMessage = (message) => {
            setMessages(prev => {
                if (!prev.find(msg => msg._id === message._id)) {
                    return [...prev, message];
                }
                return prev;
            });
        };
        socket.on('newMessage', handleNewMessage);
        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.emit('leaveRoom', room);
        };
    }, [room]);

    // Send message
    const sendMessage = async () => {
        if (newMessage.trim() === "" || !getSenderId(currentUser)) return;

        const messageData = {
            text: newMessage,
            sender: getSenderId(currentUser),
            chat_type: chatType,
            ref_id: chatType !== "global" ? chatId : null,
        };

        try {
            // Save to database first
            await axios.post('http://localhost:4000/api/messages', messageData);
            setNewMessage("");
        }catch (error) {
            console.error('Error saving message:', error);
        }
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter'){
            sendMessage();
        }
    }
    return (
        <div className="chat-room-container">
            <div className="chat-room">
                <div className="chat-header">{chatTitle}</div>

                <div className="chat-messages">
                    {loading ? (
                        <p>Loading messages...</p>
                    ) : messages.map((msg, index) => (
                        <div
                            key={msg._id || index}
                            className={`chat-message ${getSenderId(msg.sender) === getSenderId(currentUser) ? "my-message" : ""}`}
                        >
                            {getSenderId(msg.sender) !== getSenderId(currentUser) && (
                                <strong className="other-username">
                                    {getUsername(msg.sender) + ": "}
                                </strong>
                            )}
                            <span className="message-text">{msg.text}</span>
                            <span className="timestamp">
                                {new Date(msg.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                                {" - "}
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="chat-input">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message..."
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;

// reference the workflow at this doc:
// https://medium.com/@abbasashraff12313/creating-a-real-time-chat-application-with-socket-io-and-react-ecca78c13819