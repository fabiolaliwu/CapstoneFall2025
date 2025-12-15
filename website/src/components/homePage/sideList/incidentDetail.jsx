import './incidentDetail.css';
import { IoArrowBack } from "react-icons/io5";
import { LuCalendarClock, LuMapPin } from "react-icons/lu";
import { MdOutlineChat } from "react-icons/md";

const CategoryColors = [
    "#6e98a3", "#4A6CF7", "#8E7AB5", "#E1AFAF", "#7FB77E",
    "#D97D54", "#A6D0DD", "#C5A3FF", "#FFC3A1", "#82A0D8"
];

function getRandomColor() {
    const random_index = Math.floor(Math.random() * CategoryColors.length);
    return CategoryColors[random_index];
}

function IncidentDetail({ incident, onClose, onOpenChat, currentUser }) {
    let fullDateString = '';
    if (incident.createdAt) {
        const occuredTime = new Date(incident.createdAt);
        const occuredTimeFormat = {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        fullDateString = occuredTime.toLocaleString('en-US', occuredTimeFormat);
    }

    const handleChatClick = () => {
        if (!currentUser) {
            alert('Please log in to view the chat room');
            return;
        }
        // Double check token exists
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to view the chat room');
            return;
        }
        onOpenChat();
    };

    return(
        <div className="incident-detail-container">

            {/* HEADER */}
            <div className="incident-detail-header">
                <button className="back-button" onClick={onClose}>
                    <IoArrowBack size={24} />
                </button>
                <button className="open-chat-button" onClick={handleChatClick}>
                    <span className="chat-button-text">OPEN INCIDENT CHAT</span>
                    <MdOutlineChat size={20} />
                </button>
            </div>

            {/* IMAGE */}
            {incident.image && (
                <div className="incident-image-wrapper">
                    <img 
                        src={incident.image} 
                        alt={incident.title} 
                        className="incident-image"
                    />
                </div>
            )}

            {/* BODY */}
            <div className="incident-detail-body">
                <div className="scroll-wrapper">
                    {/* category */}
                    {Array.isArray(incident.category) && incident.category.length > 0 && (
                        <div className="category-container">
                            {incident.category.map((cat, index) => (
                                <span 
                                    key={index} 
                                    className="category" 
                                    style={{ backgroundColor: getRandomColor() }}
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    )}
                    
                    {/* title */}
                    <h2 className="incident-title">{incident.title}</h2>

                    {/* description */}
                    {incident.description && (
                        <p className="incident-description">{incident.description}</p>
                    )}

                    <div className="incident-info">
                        
                        {/* Date & Time */}
                        {fullDateString && (
                            <div className="info-item">
                                <LuCalendarClock size={24} className="info-icon" />
                                <div className="info-text">
                                    <span className="info-label">Date Occured</span>
                                    <span className="info-data">{fullDateString}</span>
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        {incident.location?.address && (
                            <div className="info-item">
                                <LuMapPin size={24} className="info-icon" />
                                <div className="info-text">
                                    <span className="info-label">Location</span>
                                    <span className="info-data">{incident.location.address}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    {incident.location?.coordinates && (
                        <button
                            className="show-map-button"
                            onClick={() => window.showRouteFromDetails(incident.location.coordinates)}
                        >
                            Show Route
                        </button>
                    )}

                </div>    
            </div>
        </div>
    );
}

export default IncidentDetail;
