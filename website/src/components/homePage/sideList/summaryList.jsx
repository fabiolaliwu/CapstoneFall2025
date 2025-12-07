import './summaryList.css';
import { BiSolidUpvote } from "react-icons/bi";
import { useIncidentUpvotes, useEventUpvotes } from './useUpvote';
import { FaHeart } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const safeBaseUrl = API_BASE_URL.replace(/\/$/, '');

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

// Train color for each line
const trainColors = {
    '1': '#D82233','2': '#D82233','3': '#D82233','4': '#009952','5': '#009952',
    '6': '#009952','7': '#9A38A1','A': '#0062CF','B': '#EB6800','C': '#0062CF',
    'D': '#EB6800','E': '#EB6800','F': '#EB6800','G': '#6CBE45','J': '#8E5C33',
    'L': '#AAAAAA','M': '#EB6800','N': '#F6BC26','Q': '#F6BC26','R': '#F6BC26',
    'S': '#808080','W': '#F6BC26','Z': '#8E5C33'
};

function SummaryList({ incidents, events, userLocation, onSelectEvents, onSelectIncident, currentUser }) {
    const [savedEvents, setSavedEvents] = useState([]);
    const [savingEventId, setSavingEventId] = useState(null);

    const {
        upvotedIncidents,
        incidentUpvoteCounts,
        upvotingIncidentId,
        toggleUpvote: toggleIncidentUpvote
    } = useIncidentUpvotes(incidents, currentUser, safeBaseUrl);

    const {
        upvotedEvents,
        eventUpvoteCounts,
        upvotingEventId,
        toggleUpvote: toggleEventUpvote
    } = useEventUpvotes(events, currentUser, safeBaseUrl);


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
    // Sort by Upvotes, then Distance
    const sorted = merged.sort((a, b) => {
        const getUpvoteCount = (item) => {
            const id = String(item._id);
            if (item.type === 'incident') {
                return incidentUpvoteCounts[id] !== undefined 
                ? incidentUpvoteCounts[id] 
                : (typeof item.upvotes === 'number' ? item.upvotes : (item.upvotes?.length || 0));
            } else {
                return eventUpvoteCounts[id] !== undefined
                ? eventUpvoteCounts[id]
                : (typeof item.upvotes === 'number' ? item.upvotes : (item.upvotes?.length || 0));
            }
        };

        const upvotesA = getUpvoteCount(a);
        const upvotesB = getUpvoteCount(b);
        // More votes goes first (B - A)
        if (upvotesB !== upvotesA) {
            return upvotesB - upvotesA;
        }

        // If votes are equal then compare Distance
        return a.distance - b.distance;
    });

    // Event save system
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
                {sorted.map(item => {
                    const itemId = String(item._id);
                    let isUpvoted = false;
                    let upvoteCount = 0;

                    if (item.type === 'incident') {
                        isUpvoted = upvotedIncidents.has(itemId);
                        upvoteCount = incidentUpvoteCounts[itemId] || 0;
                    } else {
                        isUpvoted = upvotedEvents.has(itemId);
                        upvoteCount = eventUpvoteCounts[itemId] || 0;
                    }   

                    return (
                    <div
                        key={`${item.type}-${item._id}`}
                        className="summary-item"
                        onClick={() => {
                            if (item.type === 'event') {
                                onSelectEvents(item);
                            } else {
                                onSelectIncident(item);
                            }
                        }}
                    >
                        <div className="icon">
                            <div className="left-icon">
                            <div className="summary-distance-bar">
                                {item.distance.toFixed(2)} mi
                            </div>

                            {item.type === "incident" && item.train_line && 
                            !(item.train_line.length === 1 && item.train_line[0] === "N/A") && (
                                <div className="train-lines">
                                {item.train_line.map((line) => (
                                    <span
                                    key={line}
                                    style={{
                                        backgroundColor: trainColors[line] || '#000000',
                                        color: (line === 'N' || line === 'R' ||  line === 'Q' ||  line === 'W') ? '#000000' : '#FFFFFF' 
                                    }}
                                    >
                                    {line}
                                    </span>
                                ))}
                                </div>
                            )}
                            </div>

                            <div className="right-icon">
                            <div 
                                className="upvote-icon" 
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    if (item.type === 'incident') toggleIncidentUpvote(item);
                                    else toggleEventUpvote(item);
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                            >
                                {upvoteCount > 0 &&(
                                    <span className="upvote-count">{upvoteCount}</span>
                                )}
                                <BiSolidUpvote 
                                    size={20} 
                                    color={isUpvoted ? '#ed623b' : "grey"} 
                                />
                            </div>



                            {item.type === "event" && (
                                <div
                                    className="heart-icon"
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
                );
                })} 
            </div>
            </div>
        </div>
    );
}
export default SummaryList;