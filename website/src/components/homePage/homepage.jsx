import './homepage.css';
import Bar from './bar';
import Body from './body';
import Map from '../Map';
import Buttons from './buttons';
import EventList from './sideList/eventList.jsx';   
import IncidentList from './sideList/incidentList.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Homepage() {
    const [openList, setOpenList] = useState('');
    const [events, setEvents] = useState([]);
    const [incidents, setIncidents] = useState([]);

    const toggleList = (listName) => {
        if (openList === listName) {
            setOpenList(''); // Close the list if it's already open
        } else {
            setOpenList(listName); // Open the selected list
        }
    };

    useEffect(() => {
        axios.get('http://localhost:4000/api/events')
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    }, []);


    return (
        <div className='homepage'>
            <div className = 'background'>
                <Map />
            </div>
            <div className='content'>
                <Bar />
            </div>
            <Buttons 
                openEvents={() => toggleList('events')}
                openSummary={() => toggleList('summary')}
                openIncidents={() => toggleList('incidents')}
            />

            {openList === 'events' && <EventList events={events} onClose={() => setOpenList('')} />}
            {openList === 'incidents' && <IncidentList incidents={incidents} onClose={() => setOpenList('')} />}
        </div>
    )
}
export default Homepage;
    