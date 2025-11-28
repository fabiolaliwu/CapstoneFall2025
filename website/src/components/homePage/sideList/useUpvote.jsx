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

