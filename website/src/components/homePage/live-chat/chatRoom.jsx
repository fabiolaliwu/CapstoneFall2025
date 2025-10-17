import {useEffect, useState} from "react";
import './chatRoom.css';
import axios from "axios";


//This chatroom side list implementation is for testing purpose only
//Will route under event/incident page later

function GlobalChat({ currentUser, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [userId, setUserId] = useState(null);
      
    // set user id when currentUser load
    useEffect(() => {
        console.log("currentUser:", currentUser);
        if (currentUser?._id) {
            setUserId(currentUser._id);
        }
    }, [currentUser]);

    // Load message on mount
    useEffect(() => {
        axios.get('http://localhost:4000/api/messages?chat_type=global')
            .then(response => {
                console.log('Fetched messages:', response.data);
                setMessages(response.data);
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });
    }, []);

    // Listen for new messages
    // Need to figure out how to make it real-time with websocket
    // For now, message fetched only by manual refresh
    useEffect(() => { 
        axios.get('http://localhost:4000/api/messages?chat_type=global') 
            .then(response => { 
                console.log('Fetched messages:', response.data);
                setMessages(response.data); }) 
            .catch(error => { 
                console.error('Error fetching messages:', error); 
            });
    }, []);

    const sendMessage = () => {
        if (newMessage.trim() === "" || !currentUser?._id) return;

        const messageData = {
            text: newMessage,
            sender: currentUser._id,
            chat_type: "global"
        };

        axios.post('http://localhost:4000/api/messages', messageData)
            .then(response => {
                console.log('Message sent:', response.data);
                setMessages(prevMessages => [...prevMessages, response.data]);
                setNewMessage("");
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
    }

    return (
        <div className="chat-room">
            <button className="close-btn" onClick={onClose}>►</button>
            <div className="chat-header">
                <h3>Global Chat Room</h3>
            </div>
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg._id} className="chat-message">
                        <strong>{msg.sender.username}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}
    
export default GlobalChat;

// https://medium.com/@abbasashraff12313/creating-a-real-time-chat-application-with-socket-io-and-react-ecca78c13819