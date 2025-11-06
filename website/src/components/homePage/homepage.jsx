import './homepage.css';
import Bar from './bar';
import Body from './body';
import Map from '../Map';
// import Buttons from './buttons'; // No longer rendered here
import { useState, useEffect } from 'react';
import axios from 'axios';
import EventContainer from './container/eventContainer.jsx';
import IncidentContainer from './container/incidentContainer.jsx';

function Homepage({currentUser}) {
    const [openList, setOpenList] = useState('');
    const [events, setEvents] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleList = (listName) => {
        if (openList === listName) {
            setOpenList(''); // Close the list if it's already open
        } else {
            setOpenList(listName); // Open the selected list
        }
    };

    useEffect(() => {
        // ... (your user location logic) ...
    }, []);

    return (
        <div className='homepage'>
            <div className = 'background'>
                <Map searchQuery={searchQuery} userLocation={userLocation} />
            </div>
            <div className='content'>
                {/* PASS THE PROPS TO <Bar />
                */}
                <Bar 
                    currentUser={currentUser} 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery}
                    openEvents={() => toggleList('events')}
                    openSummary={() => toggleList('summary')}
                    openIncidents={() => toggleList('incidents')}
                />
            </div>
            {/* DELETE THE <Buttons /> COMPONENT FROM HERE
            */}
            
            {/* These containers are fine and will still be toggled */}
            {openList === 'events' && < EventContainer currentUser={currentUser} events={events} userLocation={userLocation} onClose={() => setOpenList('')} /> }
            {openList === 'incidents' && < IncidentContainer currentUser={currentUser} incidents={incidents} userLocation={userLocation} onClose={() => setOpenList('')} /> }
        </div>
    );
}
export default Homepage;
// https://dev.to/choiruladamm/how-to-use-geolocation-api-using-reactjs-ndk  https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API 
/* Citation: referenced how to use axios from https://levelup.gitconnected.com/fetch-api-data-with-axios-and-display-it-in-a-react-app-with-hooks-3f9c8fa89e7b */