import { useState, useEffect } from "react";

export const useIncidentUpvotes = (incidents, currentUser, safeBaseUrl) => {

    const [upvotingIncidentId, setUpvotingIncidentId] = useState(null);
    const [upvotedIncidents, setUpvotedIncidents] = useState(new Set());
    const [incidentUpvoteCounts, setIncidentUpvoteCounts] = useState({});

    // Initialize upvote states when incidents or currentUser change
    useEffect(() => {
        const counts = {};
        const newUpvoted = new Set();

        incidents.forEach(incident => {
            counts[incident._id] = incident.upvoters?.length || 0;

            if(
                currentUser?._id && 
                incident.upvoters?.some(id => id.toString() === currentUser._id.toString())
            ) {
                newUpvoted.add(incident._id.toString());
            }
        });
        setIncidentUpvoteCounts(counts);
        setUpvotedIncidents(newUpvoted);

    }, [incidents, currentUser]);

    // Toggle upvote
    const toggleUpvote = async (incident) => {
        if (!currentUser?._id || upvotingIncidentId) return;

        const incidentId = String(incident._id);
        const alreadyUpvoted = upvotedIncidents.has(incidentId); // check current user id in the upvoter list

        setUpvotingIncidentId(incidentId);
        try {
            const res = await fetch(
                `${safeBaseUrl}/api/incidents/${incidentId}/upvote`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        user_id: currentUser._id 
                    }),
                }
            );

            if (!res.ok) throw new Error("Failed to toggle upvote");
            const data = await res.json();

            setUpvotedIncidents(prev => {
                const newSet = new Set(prev);
                if (alreadyUpvoted){
                    newSet.delete(incidentId);
                }
                else{
                    newSet.add(incidentId);
                }
                return newSet;
            });
            console.log(alreadyUpvoted ? "Incident unupvoted successfully!" : "Incident upvoted successfully!");

            setIncidentUpvoteCounts(prev => ({
                ...prev,
                [incidentId]: data.upvotes
            }));

        }finally {
            setUpvotingIncidentId(null);
        }
    };

    return {
        upvotedIncidents,
        incidentUpvoteCounts,
        upvotingIncidentId,
        toggleUpvote
    };
};

export const useEventUpvotes = (events, currentUser, safeBaseUrl) => {
    const [upvotingEventId, setUpvotingEventId] = useState(null);
    const [upvotedEvents, setUpvotedEvents] = useState(new Set());
    const [eventUpvoteCounts, setEventUpvoteCounts] = useState({});

    // Initialize upvote states when events or currentUser change
    useEffect(() => {
        const counts = {};
        const newUpvoted = new Set();

        events.forEach(event => {
            counts[event._id] = event.upvoters?.length || 0;

            if(
                currentUser?._id && 
                event.upvoters?.some(id => id.toString() === currentUser._id.toString())
            ) {
                newUpvoted.add(event._id.toString());
            }
        });
        setEventUpvoteCounts(counts);
        setUpvotedEvents(newUpvoted);

    }, [events, currentUser]);

    // Toggle upvote
    const toggleUpvote = async (event) => {
        if (!currentUser?._id || upvotingEventId) return;

        const eventId = String(event._id);
        const alreadyUpvoted = upvotedEvents.has(eventId); // check current user id in the upvoter list

        setUpvotingEventId(eventId);
        try {
            const res = await fetch(
                `${safeBaseUrl}/api/events/${eventId}/upvote`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        user_id: currentUser._id 
                    }),
                }
            );

            if (!res.ok) throw new Error("Failed to toggle upvote");
            const data = await res.json();

            setUpvotedEvents(prev => {
                const newSet = new Set(prev);
                if (alreadyUpvoted){
                    newSet.delete(eventId);
                }
                else{
                    newSet.add(eventId);
                }
                return newSet;
            });
            console.log(alreadyUpvoted ? "Event unupvoted successfully!" : "Event upvoted successfully!");

            setEventUpvoteCounts(prev => ({
                ...prev,
                [eventId]: data.upvotes
            }));

        }finally {
            setUpvotingEventId(null);
        }
    };
    return {
        upvotedEvents,
        eventUpvoteCounts,
        upvotingEventId,
        toggleUpvote
    };
};

