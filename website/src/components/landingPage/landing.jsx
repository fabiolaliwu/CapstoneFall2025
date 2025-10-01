import {Link } from 'react-router-dom';
import './landing.css'
import Logo from '/draftLogo.png'

function Landing(){
    return(
        <div className = 'landing'>
            <img src= {Logo} alt="Logo goes here" width= "50%" />
            <Link to="/home" className="button">
                Get Started
            </Link>  
        </div>
    );
}
export default Landing;