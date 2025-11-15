import { useState } from "react";
import { IoClose } from "react-icons/io5";
import "./modal.css";

function Modal({ eventData, onClose, onSave }) {
    const [title, setTitle] = useState(eventData?.title || "");
    const [description, setDescription] = useState(eventData?.description || "");
    const [startDate, setStartDate] = useState(eventData?.start_date || "");
    const [endDate, setEndDate] = useState(eventData?.end_date || "");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(
        `http://localhost:4000/api/events/${eventData._id}`,
        {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
            title,
            description,
            start_date: startDate,
            end_date: endDate,
            }),
        }
        );

        if (res.ok) {
            const updated = await res.json();
            onSave(updated);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
        <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
        >
            <button className="modal-close" onClick={onClose}>
            <IoClose size={22} />
            </button>

            <h2>Edit Event</h2>

            <form onSubmit={handleSubmit} className="modal-form">
            <label>New Title</label>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <label>New Description</label>
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <label>Start Date</label>
            <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <label>End Date</label>
            <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />

            <button className="modal-save" type="submit">
                Save</button>
            </form>
        </div>
        </div>
    );
}

export default Modal;
