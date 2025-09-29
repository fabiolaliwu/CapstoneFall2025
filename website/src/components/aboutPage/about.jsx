import './about.css';
import logo from './logo.jpg';

function About(){
    return(
        <div className ='about-page'>
            <div className='slogan-top'>
                Stay Safe. Stay Connect.
            </div>
            <div className='slogan-bottom'>
                Stay In the LOOP
            </div>
            <img src={logo} alt="Logo" className="logo-image" />
            <div className='about-subtitle'>
                Welcome to LOOP!
            </div>
            <div className='about-description'>
                A community-driven web application built for New Yorkers.
            </div>
            <br />
            <div className='about-description'>
                Loop combines incident reports, local events, and real-time chat 
                into a single platform. Whether it’s a subway delay, a criminal incident, 
                or an upcoming neighborhood event, Loop will always keep you informed.
            </div>
            <br />
            <div className='about-subtitle'>
                Meet Our Team
            </div>
            <br />
            <div className='square-container'>
                <div className='square'>Team Member 1</div>
                <div className='square'>Team Member 2</div>
                <div className='square'>Team Member 3</div>
                <div className='square'>Team Member 4</div>
            </div>  
        </div>
    )
}
export default About;
