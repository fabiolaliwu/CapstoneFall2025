import {use, useEffect, useState} from "react";
import io from "socket.io-client";
import './chatRoom.css';
import axios from "axios";
import { set } from "mongoose";

//This chatroom side list implementation is for testing purpose only
//Will route under event/incident page later

const socket = io("http://localhost:4000");

function ChatRoom({ currentUser, chatType = "global", chatId = null, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);

    // choose room for API and socket
    const room = chatType === "global" ? "global" : `${chatType}-${chatId}`;

    // fetch chat title for selected event/incident
    const [chatTitle, setChatTitle] = useState(
        chatType === "global" ? "Global Chat" : `${chatType.charAt(0).toUpperCase() + chatType.slice(1)} Chat`
    )

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
                if(response.data.length === 0 && chatType !== 'global'){
                    const initMessage = {
                        text: `${chatType} chat started.`,
                        sender: currentUser._id,
                        chat_type: chatType,
                        ref_id: chatId,
                    };
                    await axios.post('http://localhost:4000/api/messages', initMessage);
                    setMessages([initMessage]);
                }
                else{
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
    }, [chatType, chatId, currentUser._id]);

    // Setup socket listeners
    useEffect(() => {
        socket.emit('joinRoom', room);

        const handleNewMessage = (message) => {
            console.log('Received new message:', message);
            setMessages(prev => {
                // Avoid duplicates by checking message ID
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
        if (newMessage.trim() === "" || !currentUser?._id) return;

        const messageData = {
            text: newMessage,
            sender: currentUser._id,
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
        if (e.key === 'Enter') {
            sendMessage();
        }
    }
    return (
        <div className="chat-room-container">
            <div className="chat-room">
            <div className="chat-header">
                {chatTitle}
            </div>

                <div className="chat-messages">
                    {loading ? (
                        <p>Loading messages...</p>
                    ): messages.map((msg, index) => (
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