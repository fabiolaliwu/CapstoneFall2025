import './bar.css';
import AddPost from './newPost/add_post'; 
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"; 
import { useEffect, useState } from "react";
import Logo from '/logo.png';
import Buttons from './buttons'; 
import { FaInfoCircle, FaQuestionCircle, FaUserCircle} from "react-icons/fa"; // Import icons
import { IoLogInOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";

function Bar({ 
    currentUser,
    onLogout,
    searchQuery, 
    setSearchQuery,
    openEvents,
    openSummary,
    openIncidents,
    isFilterOpen,
    setIsFilterOpen,
    filterValues,
    setFilterValues,
    activeMenu,
    setActiveMenu,
    isAddPostOpen,
    setIsAddPostOpen,
    activePostForm,
    setActivePostForm
}) {
    const navigate = useNavigate();
    const location = useLocation();    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const isHomePage = location.pathname === '/home' || location.pathname === '/';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const sideBarOpenPage = location.pathname === '/about' || 
                            location.pathname === '/help' || 
                            location.pathname === '/login' ||
                            location.pathname === '/home' ||
                            location.pathname === '/profile';
        
        if (sideBarOpenPage) {
            setIsSidebarOpen(true);
        }
    }, [location.pathname]);

    const handleFilterClick = (menuName) => {
        setActiveMenu(activeMenu === menuName ? null : menuName);
    };

    const handleNavigationAndOpen = (callback) => {
        if (!isHomePage) {
            navigate('/home'); // gp to the homepage
        }
        setTimeout(() => {
            callback(); // open the list after navigation
        }, 0);
    };

    // Handles the selection of an item from inside a dropdown menu
    const selectOption = (filterName, value) => {
        setFilterValues(prev => ({ ...prev, [filterName]: value }));
        setActiveMenu(null); // Close menu after you made your selection
    };
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && currentUser) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [currentUser]); 

    const handleLogoutClick = () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (onLogout && typeof onLogout === 'function') {
            onLogout();
        }
        setIsLoggedIn(false);
        navigate('/home');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
    };
    
    return (
        <>
        {/* Handle Side bar open and closing for mobile */}
            {/* Sidebar */}
            <div className={`bar ${isSidebarOpen ? "open" : ""}`}>
                
                {/* Top Section */}
                <div className="top-section">
                    <div className="logo">
                        <Link to="/home"  onClick={() => setIsSidebarOpen(false)}>
                            <img src={Logo} alt="Stay in the Loop" />
                        </Link>
                    </div>
                </div>
                
                {/* Middle Section */}
                <div className="middle-section">
                    {/* Show buttons to everyone*/}
                    <Buttons
                        openEvents={() => handleNavigationAndOpen(openEvents)}
                        openSummary={() => handleNavigationAndOpen(openSummary)}
                        openIncidents={() => handleNavigationAndOpen(openIncidents)}
                    />
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

                {/* Bottom Section */}
                <div className="bottom-section">
                    {isLoggedIn ? (
                        <div className="user-actions">
                            <NavLink to="/profile" className="profile-btn" title="Profile">
                                <FaUserCircle size={22} />
                            </NavLink>
                            <button className="logout-button" title="Logout" onClick={handleLogoutClick}>
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
            
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
            )}
            
            {/* Handle elements on map */}
            {isHomePage && (
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
                                className={`filter-btn ${isFilterOpen ? 'active' : ''}`}
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                            >
                                <img 
                                    src="/filter.png" 
                                    className="filter-icon"
                                    alt="Filter"
                                />
                            </button>
                        </div>
                        {/* Full filter bar appear after button is toggled */}
                        {isFilterOpen && (
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
                                            <button onClick={() => selectOption('eventCategory', 'Other')}>Other</button>
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
                                            <button onClick={() => selectOption('incidentCategory', 'Other')}>Other</button>
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
                    {/* Only show AddPost button if logged in */}
                        <div className="addpost">
                            <AddPost 
                                currentUser={currentUser} 
                                showDropdown={isAddPostOpen}
                                setShowDropdown={setIsAddPostOpen}
                                showForm={activePostForm}
                                setShowForm={setActivePostForm}
                            />
                        </div>
                </div>
            )}
        </>
    );
}
export default Bar;