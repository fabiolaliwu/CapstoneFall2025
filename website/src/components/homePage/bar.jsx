import './bar.css';
import AddPost from './newPost/add_post'; 
import { Link, NavLink, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import Logo from '/logo.png';

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
        <>
            {/* --- THE SIDEBAR --- */}
            <div className="bar">       
                <div className="top-section">
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
                

                {/* --- MIDDLE SCROLLABLE SECTION --- */}
                <div className="middle-section">
                </div>

                {/* --- BOTTOM SECTION --- */}
                <div className="bottom-section">
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
                        <AddPost currentUser={currentUser} />
                </div>
            )}
        </>
    );
}
export default Bar;