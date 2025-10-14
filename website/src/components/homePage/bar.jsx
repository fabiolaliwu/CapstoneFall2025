import './bar.css';
import AddPost from './newPost/add_post'; 
import { Link, NavLink, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import Logo from '/titlelogo.png'

function Bar(){
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }
    , []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/home');
    }


    return(
        <div className='bar'>
            <div className = 'logo'>
            <Link to="/home"><img src= {Logo} alt="Stay in the Loop"  /></Link> 
            </div>
            <div className ='information'>
                {isLoggedIn && (
                    <div className='addpost'>
                        <AddPost />
                    </div>
                )}
                {isLoggedIn ? (
                    <button onClick={handleLogout} className="logout-button">Log Out</button>
                ) :
                    <NavLink to="/login" className="login">
                        Sign In
                    </NavLink>
                }
                <div className='about'>
                    <NavLink to="/about"  className={({ isActive }) => isActive ? 'active-link' : ''}>
                        About
                    </NavLink>
                </div>
                <div className='help'>
                    <NavLink to="/help"  className={({ isActive }) => isActive ? 'active-link' : ''}>
                        Help
                    </NavLink>                
                </div>
            </div>
        </div>
    )
}
export default Bar;