import './summaryList.css';
import { FaHeart } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const calculateDistance = (loc1, loc2) => {
    if (!loc1 || !loc2) return Infinity;
    const toRad = degree => degree * (Math.PI / 180);
    const R = 3958.8;

    const dLat = toRad(loc2.lat - loc1.lat);
    const dLon = toRad(loc2.lng - loc1.lng);
    const lat1 = toRad(loc1.lat);
    const lat2 = toRad(loc2.lat);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

function SummaryList({ incidents, events, userLocation, onSelect, currentUser }) {
    const [savedEvents, setSavedEvents] = useState([]);
    const [savingEventId, setSavingEventId] = useState(null);

    const incidentsArr = incidents || [];
    const eventsArr = events || [];


    // Combine both
    const merged = [
        ...incidentsArr.map(inc => ({
            ...inc,
            type: 'incident',
            distance: calculateDistance(userLocation, inc.location?.coordinates)
        })),
        ...eventsArr.map(evt => ({
            ...evt,
            type: 'event',
            distance: calculateDistance(userLocation, evt.location?.coordinates)
        })),
    ];

    // Sort by distance DESCENDING
    const sorted = merged.sort((a, b) => a.distance - b.distance);

    // Event save system (unchanged)
    const handleSaveEvent = async (event) => {
        if (!currentUser?._id || savingEventId) return;
        const eventId = String(event._id);
        const wasSaved = savedEvents.includes(eventId);

        setSavingEventId(eventId);
        setSavedEvents(prev =>
            wasSaved ? prev.filter(id => id !== eventId) : [...prev, eventId]
        );

        try {
            const response = await fetch(
                `http://localhost:4000/api/users/${currentUser._id}/savedEvents`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ eventId: event._id }),
                }
            );

            if (!response.ok) throw new Error('Failed to save/unsave event');
        } catch (error) {
            console.error('Error saving/unsaving event:', error);
        } finally {
            setSavingEventId(null);
        }
    };

    useEffect(() => {
        const fetchSavedEvents = async () => {
            if (!currentUser?._id) return;

            try {
                const response = await fetch(
                    `http://localhost:4000/api/users/${currentUser._id}/savedEvents`
                );

                if (response.ok) {
                    const data = await response.json();
                    const ids = Array.isArray(data)
                        ? data.map(item => String(item._id || item))
                        : [];
                    setSavedEvents(ids);
                }
            } catch (err) {
                console.error('Error loading saved events:', err);
            }
        };

        fetchSavedEvents();
    }, [currentUser?._id]);

    return (
        <div className="summary-list-container">
            <div className="summary-list">
                <header>ALL ACTIVITY</header>
                <div className="summary-items">
                    {sorted.map(item => (
                        <div
                            key={`${item.type}-${item._id}`}
                            className="summary-item"
                            onClick={() => onSelect({ type: item.type, id: item._id })}
                        >
                            <div className="distance-heart-container">
                                <div className="summary-distance-bar">
                                    {item.distance.toFixed(2)} mi
                                </div>
                                {item.type === "event" && (
                                    <div
                                        className="save-event-icon"
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleSaveEvent(item);
                                        }}
                                    >
                                        <FaHeart
                                            color={
                                                savedEvents.includes(String(item._id))
                                                    ? '#f03e82'
                                                    : 'grey'
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            {item.type === "incident" ? (
                                <span>
                                    Time Occurred:{' '}
                                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            ) : (
                                <>
                                    <span>
                                        Start Date:{' '}
                                        {new Date(item.start_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                    <br />
                                    <span>
                                        End Date:{' '}
                                        {item.end_date
                                            ? new Date(item.end_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })
                                            : 'None'}
                                    </span>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default SummaryList;