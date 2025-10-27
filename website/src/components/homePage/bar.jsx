import './bar.css';
import AddPost from './newPost/add_post'; 
import { Link, NavLink, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import Logo from '/titlelogo.png';

function Bar({ currentUser }) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);        

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/home');
    };

    return (
        <div className="bar">

            <div className="left-bar">            
            <div className="logo">
                <Link to="/home"><img src={Logo} alt="Stay in the Loop" /></Link>
            </div>
                            <hr className="divider" />
                <div className="about">
                    <NavLink to="/about" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                        About
                    </NavLink>
                </div>
                
                <div className="help">
                    <NavLink to="/help" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                        Help
                    </NavLink>
                </div>
            </div>

            {isLoggedIn && (
                <div className="search-bar">
                    <img src="https://cdn-icons-png.flaticon.com/512/622/622669.png" alt="Search" className="search-icon"/>
                    <input type="text" className="search-input"/>
                </div>
            )}

            <div className="information">
                {isLoggedIn && (
                    <div className="addpost">
                        <AddPost currentUser={currentUser} />
                    </div>
                )}
                {isLoggedIn && (
                    <hr className="divider" />
                )}
                {isLoggedIn ? (
                    <button onClick={handleLogout} className="logout-button">Log Out</button>
                ) : 
                    <NavLink to="/login" className="login">
                        Sign In
                    </NavLink>
                }
            </div>
        </div>
    )
}
export default Bar;