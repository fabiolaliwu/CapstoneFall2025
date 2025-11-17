import './incidentDetail.css';
import { IoArrowBack } from "react-icons/io5";
import { LuCalendarClock, LuMapPin } from "react-icons/lu";

function IncidentDetail({ incident, onClose }) {
    let fullDateString = '';
    if (incident.createdAt) {
        const occuredTime = new Date(incident.createdAt);
        const occuredTimeFormat = {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        fullDateString = occuredTime.toLocaleString('en-US', occuredTimeFormat);
    }

    return(
        <div className="incident-detail-container">

            {/* HEADER */}
            <div className="incident-detail-header">
                <button className="back-button" onClick={onClose}>
                    <IoArrowBack size={24} />
                </button>
            </div>

            {/* IMAGE */}
            {incident.image && (
                <img 
                    src={incident.image} 
                    alt={incident.title} 
                    className="incident-image"
                />
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
                </div>    
            </div>
        </div>
    );
}

export default IncidentDetail;
