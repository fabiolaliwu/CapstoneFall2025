import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import './chatRoom.css';
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
const safeBaseUrl = API_BASE_URL.replace(/\/$/, ''); // Removes trailing slash for API calls

function ChatRoom({ currentUser, chatType = "global", chatId = null, onClose, eventTitle }) {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [isActiveNow, setIsActiveNow] = useState(false);
    const messagesEndRef = useRef(null);

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
                const response = await axios.get(`${safeBaseUrl}/api/messages?chat_type=${chatType}&ref_id=${chatId}`);

                if (chatType !== "global" && chatId) {
                    const resTitle = await axios.get(`${safeBaseUrl}/api/${chatType}s/${chatId}`);
                    setChatTitle(resTitle.data.title || `${chatType} Chat`);
                }
                // if the chat has no message yet
                if (response.data.length === 0) {
                    const initMessage = {
                        text: `${chatType} chat started.`,
                        sender: currentUser._id,
                        chat_type: chatType,
                        ref_id: chatId,
                        createdAt: new Date().toISOString(),
                    };
                    await axios.post(`${safeBaseUrl}/api/messages`, initMessage);
                    setMessages([initMessage]);
                } else{
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
    }, [chatType, chatId, currentUser]);

    // Setup socket listeners
    useEffect(() => {
        const socket = io(SOCKET_URL);
        setSocket(socket);
        socket.emit('joinRoom', room);

        const handleNewMessage = (message) => {
            console.log("Received new message:", message);
            // avoid duplicate message
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
            // socket.disconnect();
        };
    }, [room]);

    // Send message
    const sendMessage = async () => {
        if (newMessage.trim() === "" || !currentUser?._id) return;

        const messageData = {
            text: newMessage,
            sender: currentUser._id,
            chat_type: chatType,
            ref_id: chatType !== "global" ? chatId : null,
        };

        try {
            // Save to database first
            await axios.post(`${safeBaseUrl}/api/messages`, messageData);
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

    // Determination of chatroom active status
    useEffect(() => {
        if (!messages || messages.length === 0) {
            setIsActiveNow(false);
            return;
        }
        const tenMinutes = 10 * 60 * 1000; // 10 mins
        const now = new Date();
        // check if the message is within last 10 mins
        const recentMessage = messages.some(msg => {
            const msgTime = new Date(msg.createdAt);
            return now - msgTime <= tenMinutes; // 
        });
        setIsActiveNow(recentMessage);
    }, [messages]);
    
    //auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" ,block: "end" });
    }, [messages]);    

    return (
        <div className={`chat-room-container ${
            chatType === "incident" || chatType === "event" ? "chat-room-mobile" : ""
          }`}>
            
            <div className="chat-room">
                <div className="chat-header">
                    {chatType !== "global" && onClose && (
                        <button className="chat-back-button" onClick={onClose}>
                            <IoArrowBack size={24} />
                        </button>
                    )}
                    <span className="chat-title-text">{eventTitle || chatTitle}</span>
                    {isActiveNow && (
                        <span className="active-status">
                            <img src="/activeIcon.png" alt="Active Now" className="active-icon"/>
                            <span className="active-text">Active Now</span>
                        </span>
                    )}
                </div>

                <div className="chat-messages">
                    {loading ? (
                        <p>Loading messages...</p>
                    ) : messages.map((msg, index) => (
                        <div
                            key={msg._id || index}
                            className={`chat-message ${msg.sender?._id === currentUser?._id ? "my-message" : ""}`}
                        >
                            {msg.sender?._id !== currentUser?._id && (
                                <strong className="other-username">
                                    {(msg.sender?.username || "Unknown") + ": "}
                                </strong>
                                )}
                            <span className="message-text">{msg.text}</span>
                            <span className="timestamp">
                                {new Date(msg.createdAt).toLocaleDateString([], {
                                    month: "short",
                                    day: "numeric"
                                })}{" - "}
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
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
