import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Homepage from './components/homePage/homepage'
import Login from "./components/loginPage/login";
import Signup from "./components/signupPage/signup";
import About from "./components/aboutPage/about";
import Help from "./components/helpPage/help";
import './index.css'
import { useState, useEffect } from "react";

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    // Load user on main page load
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    } ,[]);
    
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage currentUser={currentUser} />} />
                <Route path="/home" element={<Homepage currentUser={currentUser} />} />
                <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<Help />} />
            </Routes>
        </Router>
    );
}

export default App;