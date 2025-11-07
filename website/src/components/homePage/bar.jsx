import './bar.css';
import AddPost from './newPost/add_post'; 
import { Link, NavLink, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import Logo from '/logo.png';
import Buttons from './buttons'; 
import { FaInfoCircle, FaQuestionCircle, FaUserCircle } from "react-icons/fa"; // Import icons

function Bar({ 
    currentUser, 
    searchQuery, 
    setSearchQuery,
    openEvents,
    openSummary,
    openIncidents 
}) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [currentUser]); 

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/home');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
    };
    
    return (
        <>
            {/* --- THE SIDEBAR --- */}
            <div className="bar">       
                
                {/* --- TOP SECTION --- */}
                <div className="top-section">
                    <div className="logo">
                        <Link to="/home"><img src={Logo} alt="Stay in the Loop" /></Link>
                    </div>
                </div>
                
                {/* --- MIDDLE SECTION --- */}
                <div className="middle-section">
                    {isLoggedIn && (
                        <Buttons
                            openEvents={openEvents}
                            openSummary={openSummary}
                            openIncidents={openIncidents}
                        />
                    )}

                    <hr className="divider" />
                    <div className="nav-links">
                        <NavLink to="/about" className="nav-link-button">
                            <FaInfoCircle size={20} />
                            <span className="btn-text">About</span>
                        </NavLink>
                        <NavLink to="/help" className="nav-link-button">
                            <FaQuestionCircle size={20} />
                            <span className="btn-text">Help</span>
                        </NavLink>
                    </div>
                </div>

                {/* --- BOTTOM SECTION --- */}
                <div className="bottom-section">
                    {isLoggedIn ? (
                        <div className="user-actions">
                            <NavLink to="/profile" className="profile-btn" title="Profile">
                                {/* 4. Replaced :D with an icon */}
                                <FaUserCircle size={22} />
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
            
            {/* --- FLOATING CONTROLS (Unaffected) --- */}
            {isLoggedIn && (
                <div className="floating-controls">
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
                    <div className="addpost">
                        <AddPost currentUser={currentUser} />
                    </div>
                </div>
            )}
        </>
    );
}
export default Bar;