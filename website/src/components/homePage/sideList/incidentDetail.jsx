import './incidentDetail.css';
import { IoArrowBack } from "react-icons/io5";

function IncidentDetail({ incident, onClose }) {
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
                {/*  category tags */}
                {incident.category && incident.category.length > 0 && (
                    <div className="incident-category">
                        {incident.category}
                    </div>
                )}
                {/* title */}
                <h2 className="incident-title">{incident.title}</h2>

                {/* description */}
                {incident.description && (
                        <>
                            <p><strong>Description:</strong></p>
                            <p>{incident.description}</p>
                        </>
                    )
                }
                {/* Date */}
                <p>
                    <strong>Date Occured: </strong>
                    {new Date(incident.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>

                {/* Location */}
                <p><strong>Location:</strong> {incident.location.address}</p>
            </div>

        </div>
    );
}

export default IncidentDetail;
