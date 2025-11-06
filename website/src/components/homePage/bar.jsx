import './bar.css';
import AddPost from './newPost/add_post'; 
import { Link, NavLink, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import Logo from '/titlelogo.png';

function Bar({ currentUser, searchQuery, setSearchQuery, showForm, closeForm }) {
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

    const handleSearch = async (e) => {
        e.preventDefault();
    };
    
    return (
        // Use a Fragment to return the sidebar AND the new floating controls
        <>
            {/* --- 1. THE SIDEBAR --- */}
            <div className="bar">

                {/* --- TOP SECTION --- */}
                <div className="left-bar">
                    
                    <div className="top-row">
                        <div className="logo">
                            <Link to="/home"><img src={Logo} alt="Stay in the Loop" /></Link>
                        </div>
                        
                        <div className="nav-links">
                            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                About
                            </NavLink>
                            <NavLink to="/help" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                Help
                            </NavLink>
                        </div>
                    </div>
                    
                    {/* Search bar and Add Post are MOVED OUT */}
                </div>

                {/* --- MIDDLE SCROLLABLE SECTION --- */}
                <div className="center-bar-content">
                    {showForm && (
                        <div className="form-wrapper">
                            {/* Your form content goes here */}
                            <button onClick={closeForm}>Close Form</button>
                        </div>
                    )}
                </div>

                {/* --- BOTTOM SECTION --- */}
                <div className="information">
                    {/* Divider and Add Post are MOVED OUT */}
                    
                    {isLoggedIn ? (
                        <div className="user-actions">
                            <NavLink to="/profile" className="profile-btn" title="Profile">
                                :D
                            </NavLink>
                            <button onClick={handleLogout} className="logout-button" title="Logout">
                                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828479.png" alt="Logout" className="logout-icon"/>
                            </button>
                        </div>
                    ) : 
                        <NavLink to="/login" className="login">
                            Sign In
                        </NavLink>
                    }
                </div>
            </div>
            
            {/* --- 2. NEW FLOATING CONTROLS (Search + Add Post) --- */}
            {isLoggedIn && (
                <div className="floating-controls">
                    {/* SEARCH BAR (MOVED HERE) */}
                    <form className="search-bar" onSubmit={handleSearch}>
                        <img src="https://cdn-icons-png.flaticon.com/512/622/622669.png" alt="Search" className="search-icon"/>
                        <input 
                            type="text" 
                            className="search-input"
                            placeholder="Enter a keyword"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                    
                    {/* ADD POST (MOVED HERE) */}
                        <AddPost currentUser={currentUser} />
                </div>
            )}
        </>
    );
}
export default Bar;