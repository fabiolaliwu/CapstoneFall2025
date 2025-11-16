import './eventDetail.css';
import { IoArrowBack } from "react-icons/io5";

const CategoryColors = [
    "#6e98a3", "#4A6CF7", "#8E7AB5", "#E1AFAF", "#7FB77E",
    "#D97D54", "#A6D0DD", "#C5A3FF", "#FFC3A1", "#82A0D8"
];

function getRandomColor() {
    const random_index = Math.floor(Math.random() * CategoryColors.length);
    return CategoryColors[random_index];
}

function EventDetail({ event, onClose }) {
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
                {/*  category tags */}
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
                <p><strong>Description:</strong></p>
                <p>{event.description}</p>

                {/* Organiser */}
                {event.host && (
                    <p>
                        <strong>Host: </strong>{event.host}
                    </p>
                )}

                {/* Cost */}
                {event.cost && (
                    <p><strong>Cost:</strong> {event.cost}</p>
                )}

                {/* Date */}
                <p>
                    <strong>Start Date: </strong>
                    {new Date(event.start_date).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>

                <p>
                    <strong>End Date: </strong>
                    {event.end_date
                        ? new Date(event.end_date).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            })
                    : 'None'}
                </p>
                {/* Location */}
                <p><strong>Location:</strong> {event.location.address}</p>
            </div>

        </div>
    );
}

export default EventDetail;
