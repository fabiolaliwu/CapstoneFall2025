import './homepage.css';
import Bar from './bar';
import Body from './body';
import Map from '../Map';
import Buttons from './buttons';
import IncidentList from './sideList/incidentList.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';
import GlobalChat from './live-chat/chatRoom.jsx';
import EventContainer from './container/eventContainer.jsx';

function Homepage({currentUser}) {
    const [openList, setOpenList] = useState('');
    const [events, setEvents] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    const toggleList = (listName) => {
        if (openList === listName) {
            setOpenList(''); // Close the list if it's already open
        } else {
            setOpenList(listName); // Open the selected list
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

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/incidents')
                setIncidents(response.data);
            } catch (error) {
                console.error('Error fetching incidents:', error);
            }
        };
        fetchIncidents();
    }, []);

    return (
        <div className='homepage'>
            <div className = 'background'>
                <Map />
            </div>
            <div className='content'>
                <Bar currentUser={currentUser} />
            </div>
            <Buttons 
                openEvents={() => toggleList('events')}
                openSummary={() => toggleList('summary')}
                openIncidents={() => toggleList('incidents')}
                openMessages={() => toggleList('chat')}
            />
            {openList === 'chat' && <GlobalChat currentUser={currentUser} onClose={() => setOpenList('')} />}
            {openList === 'events' && < EventContainer currentUser={currentUser} events={events} userLocation={userLocation} onClose={() => setOpenList('')} /> }
            {openList === 'incidents' && <IncidentList incidents={incidents} userLocation={userLocation} onClose={() => setOpenList('')} />}
        </div>
    );
}
export default Homepage;

// https://dev.to/choiruladamm/how-to-use-geolocation-api-using-reactjs-ndk  https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API 
/* Citation: referenced how to use axios from https://levelup.gitconnected.com/fetch-api-data-with-axios-and-display-it-in-a-react-app-with-hooks-3f9c8fa89e7b */