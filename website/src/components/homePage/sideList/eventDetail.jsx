import './eventDetail.css';
import { IoArrowBack } from "react-icons/io5";
import { LuCalendarClock, LuMapPin, LuTicket, LuUser } from "react-icons/lu";
import { MdOutlineChat } from "react-icons/md";

const CategoryColors = [
    "#6e98a3", "#4A6CF7", "#8E7AB5", "#E1AFAF", "#7FB77E",
    "#D97D54", "#A6D0DD", "#C5A3FF", "#FFC3A1", "#82A0D8"
];

function getRandomColor() {
    const random_index = Math.floor(Math.random() * CategoryColors.length);
    return CategoryColors[random_index];
}

function EventDetail({ event, onClose, onOpenChat }) {
    let fullDateString = '';
    if (event.start_date) {
        const startDate = new Date(event.start_date);
        const startDateFormat = {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        fullDateString = startDate.toLocaleString('en-US', startDateFormat);

        if (event.end_date) {
            const endDate = new Date(event.end_date);
            let endDateFormat;
            if (endDate.toDateString() !== startDate.toDateString()){
                endDateFormat = { year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit' };
            } else {
                endDateFormat = { hour: '2-digit', minute: '2-digit' };
            }        
            const endDateString = endDate.toLocaleString('en-US', endDateFormat);
            fullDateString += ` - ${endDateString}`;
        }
    }

    return(
        <div id="event-detail" className="event-detail-container">

            {/* HEADER */}
            <div id="event-detail-header" className="event-detail-header">
                <button id="event-detail-back" className="back-button" onClick={onClose}>
                    <IoArrowBack size={24} />
                </button>
                <button id="event-chat-button" className="open-chat-button" onClick={onOpenChat}>
                    <span className="chat-button-text">OPEN EVENT CHAT</span>
                    <MdOutlineChat size={20} />
                </button>
            </div>

            {/* IMAGE */}
            {event.image && (
                <div className="event-image-wrapper">
                    <img 
                        src={event.image} 
                        alt={event.title} 
                        className="event-image"
                    />
                </div>
            )}


            {/* BODY */}
            <div className="event-detail-body">
                <div className="scroll-wrapper">
                    {/* category */}
                    {Array.isArray(event.category) && event.category.length > 0 && (
                        <div className="category-container">
                            {event.category.map((cat, index) => (
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
                    <h2 className="event-title">{event.title}</h2>

                    {/* description */}
                    {event.description && (
                        <p className="event-description">{event.description}</p>
                    )}

                    <div className="event-info">
                        
                        {/* Date & Time */}
                        {fullDateString && (
                            <div className="info-item">
                                <LuCalendarClock size={24} className="info-icon" />
                                <div className="info-text">
                                    <span className="info-label">Date & Time</span>
                                    <span className="info-data">{fullDateString}</span>
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        {event.location?.address && (
                            <div className="info-item">
                                <LuMapPin size={24} className="info-icon" />
                                <div className="info-text">
                                    <span className="info-label">Location</span>
                                    <span className="info-data">{event.location.address}</span>
                                </div>
                            </div>
                        )}

                        {/* Cost */}
                        {event.cost && (
                            <div className="info-item">
                                <LuTicket size={24} className="info-icon" />
                                <div className="info-text">
                                    <span className="info-label">Cost</span>
                                    <span className="info-data">{event.cost}</span>
                                </div>
                            </div>
                        )}

                        {/* Host */}
                        {event.host && (
                            <div className="info-item">
                                <LuUser size={24} className="info-icon" />
                                <div className="info-text">
                                    <span className="info-label">Host</span>
                                    <span className="info-data">{event.host}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    {event.location?.coordinates && (
                        <button
                            className="show-map-button"
                            onClick={() => window.showRouteFromDetails(event.location.coordinates)}
                        >
                            Show Route
                        </button>
                    )}

                </div>    
            </div>
        </div>
    );
}

export default EventDetail;