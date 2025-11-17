import './eventDetail.css';
import { IoArrowBack } from "react-icons/io5";
// Import new icons for the list
import { LuCalendarClock, LuMapPin, LuTicket, LuUser } from "react-icons/lu";

const CategoryColors = [
    "#6e98a3", "#4A6CF7", "#8E7AB5", "#E1AFAF", "#7FB77E",
    "#D97D54", "#A6D0DD", "#C5A3FF", "#FFC3A1", "#82A0D8"
];

function getRandomColor() {
    const random_index = Math.floor(Math.random() * CategoryColors.length);
    return CategoryColors[random_index];
}

function EventDetail({ event, onClose }) {
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
        <div className="event-detail-container">

            {/* HEADER */}
            <div className="event-detail-header">
                <button className="back-button" onClick={onClose}>
                    <IoArrowBack size={24} />
                </button>
            </div>

            {/* IMAGE */}
            {event.image && (
                <img 
                    src={event.image} 
                    alt={event.title} 
                    className="event-image"
                />
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
                </div>    
            </div>
        </div>
    );
}

export default EventDetail;