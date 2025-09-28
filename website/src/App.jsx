import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Homepage from './components/homePage/homepage'
import About from "./components/aboutPage/about";
import Help from "./components/helpPage/help";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<Help />} />
            </Routes>
        </Router>
    );
}

export default App;