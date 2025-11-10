import './homepage.css';
import Bar from './bar';
import Body from './body';
import Map from '../Map';
import { useState, useEffect } from 'react';
import EventContainer from './container/eventContainer.jsx';
import IncidentContainer from './container/incidentContainer.jsx';

function Homepage({currentUser}) {
    const [openList, setOpenList] = useState('');
    const [events, setEvents] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [mapSelectedId, setMapSelectedId] = useState(null);

    const toggleList = (listName) => {
        if (openList === listName) {
            setOpenList(''); // Close the list if it's already open
            setMapSelectedId(null);
        } else {
            setOpenList(listName); // Open the selected list
        }
    };
    const openChatFromMap = (type, id) => {
        setMapSelectedId(id);
        if (type === 'event') {
            setOpenList('events');
        } else if (type === 'incident') {
            setOpenList('incidents');
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Location enabled');
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting location', error);
                }
            );
        }
    }, []);

    const handleCloseContainer = () => {
        setOpenList('');
        setMapSelectedId(null);
    }

    return (
        <div className='homepage'>
            <div className = 'background'>
                <Map searchQuery={searchQuery} userLocation={userLocation} openChatFromMap={openChatFromMap} />
            </div>
            <div className='content'>
                <Bar 
                    currentUser={currentUser} 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery}
                    openEvents={() => toggleList('events')}
                    openSummary={() => toggleList('summary')}
                    openIncidents={() => toggleList('incidents')}
                />
            </div>

            {openList === 'events' && < EventContainer currentUser={currentUser} events={events} userLocation={userLocation} onClose={handleCloseContainer} initialSelectedId={mapSelectedId} /> }
            {openList === 'incidents' && < IncidentContainer currentUser={currentUser} incidents={incidents} userLocation={userLocation} onClose={handleCloseContainer} initialSelectedId={mapSelectedId} /> }
        </div>
    );
}
export default Homepage;

// https://dev.to/choiruladamm/how-to-use-geolocation-api-using-reactjs-ndk  https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API 
/* Citation: referenced how to use axios from https://levelup.gitconnected.com/fetch-api-data-with-axios-and-display-it-in-a-react-app-with-hooks-3f9c8fa89e7b */