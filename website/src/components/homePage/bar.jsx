import './bar.css';
import AddPost from './newPost/add_post'; 
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"; 
import { useEffect, useState } from "react";
import Logo from '/logo.png';
import Buttons from './buttons'; 
import { FaInfoCircle, FaQuestionCircle, FaUserCircle, FaFilter } from "react-icons/fa"; // Import icons
import { IoLogInOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

function Bar({ 
    currentUser, 
    searchQuery, 
    setSearchQuery,
    openEvents,
    openSummary,
    openIncidents,
    filter,
    setFilter
}) {
    const navigate = useNavigate();
    const location = useLocation();    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const isHomePage = location.pathname === '/home' || location.pathname === '/';
    const [isFilterMode, setIsFilterMode] = useState(false);
    const [filterValues, setFilterValues] = useState({
        eventCategory: 'All',
        incidentCategory: 'All',
        dateRange: 'Any'
      });
    const [activeMenu, setActiveMenu] = useState(null);
    const handleFilterClick = (menuName) => {
        setActiveMenu(activeMenu === menuName ? null : menuName);
    };

    const selectOption = (filterName, value) => {
        setFilterValues(prev => ({ ...prev, [filterName]: value }));
        setActiveMenu(null); // Close menu on selection
    };
    
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
            
            {/* Handle elements on map */}
            {isLoggedIn && isHomePage && (
                <div className="floating-controls">
                    <div className="search-bar-wrapper">
                        <div className="search-bar">
                            <form className="search-form" onSubmit={handleSearch}>
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
                        {/* Filter Button */}
                        <button 
                                className={`filter-btn ${isFilterMode ? 'active' : ''}`}
                                onClick={() => setIsFilterMode(!isFilterMode)}
                            >
                                <img 
                                    src="/filter.png" 
                                    className="filter-icon"
                                    alt="Filter"
                                />
                            </button>
                        </div>
                        {/* Full Filter Bar */}
                        {isFilterMode && (
                            <div className="filter-bar">
                                {/* Filter 1: Event Category */}
                                <div className="filter-item-wrapper">
                                    <button className="filter-select-btn" onClick={() => handleFilterClick('eventCategory')}>
                                        <span className="filter-label">event category</span>
                                        <span className="filter-value">
                                            {filterValues.eventCategory}
                                            <span className="filter-arrow"></span>
                                        </span>
                                    </button>
                                    {activeMenu === 'eventCategory' && (
                                        <div className="filter-dropdown-menu">
                                            <button onClick={() => selectOption('eventCategory', 'All')}>All</button>
                                            <button onClick={() => selectOption('eventCategory', 'Street Fair')}>Street Fair</button>
                                            <button onClick={() => selectOption('eventCategory', 'Food & Drink')}>Food & Drink</button>
                                            <button onClick={() => selectOption('eventCategory', 'Pop-Up')}>Pop-Up</button>
                                            <button onClick={() => selectOption('eventCategory', 'Networking')}>Networking</button>
                                            <button onClick={() => selectOption('eventCategory', 'Concert/Live Music')}>Concert/Live Music</button>
                                            <button onClick={() => selectOption('eventCategory', 'Neighborhood')}>Neighborhood</button>
                                            <button onClick={() => selectOption('eventCategory', 'Job')}>Job</button>
                                            <button onClick={() => selectOption('eventCategory', 'Sports')}>Sports</button>
                                            <button onClick={() => selectOption('eventCategory', 'Pet/Animal')}>Pet/Animal</button>
                                            <button onClick={() => selectOption('eventCategory', 'Promotions')}>Promotions</button>
                                            <button onClick={() => selectOption('eventCategory', 'Education')}>Education</button>

                                        </div>
                                    )}
                                </div>
                                <div className="filter-divider"></div>

                                {/* Filter 2: Incident Category */}
                                <div className="filter-item-wrapper">
                                    <button className="filter-select-btn" onClick={() => handleFilterClick('incidentCategory')}>
                                        <span className="filter-label">incident category</span>
                                        <span className="filter-value">
                                            {filterValues.incidentCategory}
                                            <span className="filter-arrow"></span>
                                        </span>
                                    </button>
                                    {activeMenu === 'incidentCategory' && (
                                        <div className="filter-dropdown-menu">
                                            <button onClick={() => selectOption('incidentCategory', 'All')}>All</button>
                                            <button onClick={() => selectOption('incidentCategory', 'Train Delayed')}>Train Delayed</button>
                                            <button onClick={() => selectOption('incidentCategory', 'Car Collision')}>Car Collision</button>
                                            <button onClick={() => selectOption('incidentCategory', 'Fire')}>Fire</button>
                                            <button onClick={() => selectOption('incidentCategory', 'Road Construction')}>Road Construction</button>
                                            <button onClick={() => selectOption('incidentCategory', 'Medical Emergency')}>Medical Emergency</button>
                                            <button onClick={() => selectOption('incidentCategory', 'Protest')}>Protest</button>
                                            <button onClick={() => selectOption('incidentCategory', 'Gun')}>Gun</button>
                                            <button onClick={() => selectOption('incidentCategory', 'Crime')}>Crime</button>
                                        </div>
                                    )}
                                </div>
                                <div className="filter-divider"></div>

                                {/* Filter 3: Date Range */}
                                <div className="filter-item-wrapper">
                                    <button className="filter-select-btn" onClick={() => handleFilterClick('dateRange')}>
                                        <span className="filter-label">date range</span>
                                        <span className="filter-value">
                                            {filterValues.dateRange}
                                            <span className="filter-arrow"></span>
                                        </span>
                                    </button>
                                    {activeMenu === 'dateRange' && (
                                        <div className="filter-dropdown-menu">
                                            <button onClick={() => selectOption('dateRange', 'Any')}>Any</button>
                                            <button onClick={() => selectOption('dateRange', 'Today')}>Today</button>
                                            <button onClick={() => selectOption('dateRange', 'Past 7 Days')}>Past 7 Days</button>
                                            <button onClick={() => selectOption('dateRange', 'Last Month')}>Last Month</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
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