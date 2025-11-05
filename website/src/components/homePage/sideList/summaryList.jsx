import './summaryList.css';

const calculateDistance = (loc1, loc2) => {
    if (!loc1 || !loc2) return Infinity;

    const toRad = (degree) => degree * (Math.PI / 180);
    const R = 3958.8;
    const dLat = toRad(loc2.lat - loc1.lat);
    const dLon = toRad(loc2.lng - loc1.lng);
    const lat1Rad = toRad(loc1.lat);
    const lat2Rad = toRad(loc2.lat);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
};

function SummaryList({ events, incidents, userLocation, onSelect }) {
    const sortedIncidents = [...incidents].sort((a, b) => {
        const locA = a.location ? a.location.coordinates : null;
        const locB = b.location ? b.location.coordinates : null;

        const distA = calculateDistance(userLocation, locA);
        const distB = calculateDistance(userLocation, locB);
        return distA - distB;
    });

    const sortedEvents = [...events].sort((a, b) => {
        const locA = a.location ? a.location.coordinates : null;
        const locB = b.location ? b.location.coordinates : null;

        const distA = calculateDistance(userLocation, locA);
        const distB = calculateDistance(userLocation, locB);

        return distA - distB;
    });

    const allPosts = [
        ...sortedIncidents.map(incident => ({
            id: incident._id,
            type: 'incident',
            title: incident.title,
            description: incident.description,
            start_date: incident.start_date,
            end_date: incident.end_date,
            distance: calculateDistance(userLocation, incident.location ? incident.location.coordinates : null)
        })),
        ...sortedEvents.map(event => ({
            id: event._id,
            type: 'event',
            title: event.title,
            description: event.description,
            start_date: event.start_date,
            end_date: event.end_date,
            distance: calculateDistance(userLocation, event.location ? event.location.coordinates : null)
        }))
    ];

    allPosts.sort((a, b) => a.distance - b.distance);

    return (
        <div className="posts-list-container">
            <div className="posts-list">
                <header>All Nearby Posts</header>
                <div className="post-items">
                    {allPosts.map((post) => (
                        <div
                            key={post.id}
                            className={`${post.type}-item`}
                            onClick={() => onSelect(post.id)}
                        >
                            <div className={`${post.type}-distance-bar`}>
                                {post.distance.toFixed(2)} mi
                            </div>
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                            <span>
                                Start Date:{' '}
                                {post.start_date
                                    ? new Date(post.start_date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        })
                                : 'None'}
                            </span>
                            <br />
                            <span>
                                End Date:{' '}
                                {post.end_date
                                ? new Date(post.end_date).toLocaleDateString('en-US',{
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                                : 'None'}
                            </span>
                        </div>
                    ))};
                </div>
            </div>
        </div>
    );
}

export default SummaryList;