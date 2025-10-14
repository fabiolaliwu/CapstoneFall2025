import './homepage.css';
import Bar from './bar';
import Body from './body';
import Map from '../Map';
import Buttons from './buttons';
import EventList from './sideList/eventList.jsx';   
import IncidentList from './sideList/incidentList.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Homepage({currentUser}) {
    return (
        <div className='homepage'>
            <div className = 'background'>
                <Map />
            </div>
            <div className='content'>
                <Bar currentUser={currentUser}/>
            </div>
            <Buttons/>
        </div>
    )
}
export default Homepage;
    
/* Citation: referenced how to use axios from https://levelup.gitconnected.com/fetch-api-data-with-axios-and-display-it-in-a-react-app-with-hooks-3f9c8fa89e7b */