import {use, useEffect, useState} from "react";
import io from "socket.io-client";
import './chatRoom.css';
import axios from "axios";

//This chatroom side list implementation is for testing purpose only
//Will route under event/incident page later

const socket = io("http://localhost:4000");

function GlobalChat({ currentUser, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);

    // pull previous chat messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                console.log('Fetching messages for global chat...');
                const response = await axios.get('http://localhost:4000/api/messages?chat_type=global');
                console.log('Fetched messages:', response.data);
                setMessages(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    // Setup socket listeners
    useEffect(() => {
        socket.emit('joinRoom', 'global');
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
            socket.emit('leaveRoom', 'global');
        };
    }, []);

    // Send message
    const sendMessage = async () => {
        if (newMessage.trim() === "" || !currentUser?._id) return;
        const messageData = {
            text: newMessage,
            sender: currentUser._id,
            chat_type: "global"
        };
        try {
            // Save to database first
            const response = await axios.post('http://localhost:4000/api/messages', messageData);
            const savedMessage = response.data;
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
        <div className="chat-room">
            <button className="close-btn" onClick={onClose}>►</button>
            <div className="chat-header">
                <h3>Global Chat Room</h3>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={msg._id || `temp=${index}`} 
                        className="chat-message"
                    >
                        <strong>{msg.sender?.username || 'Unknown'}:</strong> {msg.text}
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
    );
}
    
export default GlobalChat;

// reference the workflow at this doc:
// https://medium.com/@abbasashraff12313/creating-a-real-time-chat-application-with-socket-io-and-react-ecca78c13819