import {Link } from 'react-router-dom';
import './landing.css'

function Landing(){
    return(
        <div className = 'landing'>
            This will be the landing page
            <Link to = "/home"> Go to Home </Link>
        </div>
    );
}
export default Landing;