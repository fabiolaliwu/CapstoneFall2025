import './about.css';
import logo from './logo.jpg';

function About(){
    return(
        <div className ='about-page'>
            <div className='slogan-top'>
                Stay Safe. Stay Connect.
            </div>
            <div className='slogan-bottom'>
                Stay In the LOOP.
            </div>
            <img src={logo} alt="Logo" className="logo-image" />
            This is the about page
        </div>
    )
}
export default About;
