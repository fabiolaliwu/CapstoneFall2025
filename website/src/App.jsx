import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Homepage from './components/homePage/homepage'
import Login from "./components/loginPage/login";
import Signup from "./components/signupPage/signup";
import About from "./components/aboutPage/about";
import Help from "./components/helpPage/help";
import Bar from "./components/homePage/bar";
import './index.css'

function App() {
    return (
        <Router>
            <Bar />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<Help />} />
            </Routes>
        </Router>
    );
}

export default App;