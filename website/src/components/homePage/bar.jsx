import './bar.css';
import AddPost from './newPost/add_post'; 
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"; 
import { useEffect, useState } from "react";
import Logo from '/logo.png';
import Buttons from './buttons'; 
import { FaInfoCircle, FaQuestionCircle, FaUserCircle } from "react-icons/fa"; // Import icons
import { IoLogInOutline } from "react-icons/io5";

function Bar({ 
    currentUser, 
    searchQuery, 
    setSearchQuery,
    openEvents,
    openSummary,
    openIncidents,
    neighborhood,
    setNeighborhood
}) {
    const navigate = useNavigate();
    const location = useLocation();    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const isHomePage = location.pathname === '/home' || location.pathname === '/';
    
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
            {/* Sidebar */}
            <div className="bar">       
                
                {/* Top Section */}
                <div className="top-section">
                    <div className="logo">
                        <Link to="/home"><img src={Logo} alt="Stay in the Loop" /></Link>
                    </div>
                </div>
                
                {/* Middle Section */}
                <div className="middle-section">
                    {isLoggedIn && (
                        <Buttons
                            openEvents={openEvents}
                            openSummary={openSummary}
                            openIncidents={openIncidents}
                        />
                    )}
                    {isLoggedIn && (
                        <hr className="divider" />
                    )}
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

                {/* Bottom Section */}
                <div className="bottom-section">
                    {isLoggedIn ? (
                        <div className="user-actions">
                            <NavLink to="/profile" className="profile-btn" title="Profile">
                                <FaUserCircle size={22} />
                            </NavLink>
                            <button onClick={handleLogout} className="logout-button" title="Logout">
                                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828479.png" alt="Logout" className="logout-icon"/>
                            </button>
                        </div>
                    ) : 
                    <NavLink to="/login" className="login">
                        <IoLogInOutline size={20} />
                        <span className="btn-text">Sign In</span>
                    </NavLink>
                    }
                </div>
            </div>
            
            {/* --- Handle elements on map --- */}
            {isLoggedIn && isHomePage && (
                <div className="floating-controls">
                    <div className="search-bar-wrapper">
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
                        <div className="search-divider"></div>
                        <select
                            className="neighborhood-filter"
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                        >
                            <option value="">All Neighborhoods</option>
                            <option value="Downtown">Downtown</option>
                            <option value="Uptown">Uptown</option>
                            <option value="Midtown">Midtown</option>
                            <option value="Suburbs">Suburbs</option>
                        </select>
                    </div>
                    <div className="addpost">
                        <AddPost currentUser={currentUser} />
                    </div>
                </div>
            )}
        </>
    );
}
export default Bar;