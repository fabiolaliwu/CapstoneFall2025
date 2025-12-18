import { useState } from 'react';
import './help.css';
import Bar from '../homePage/bar';
import { startIntroTour } from '../walkthrough/introTour';
import { useNavigate } from 'react-router-dom';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const safeBaseUrl = API_BASE_URL.replace(/\/$/, '');

function Help(currentUser, onLogout) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${safeBaseUrl}/api/Contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, subject, type, message }),
      });
      if (!response.ok) throw new Error("Failed to submit form");

      setPopupMessage('Form submitted successfully!');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);

      setFullName(''); 
      setEmail(''); 
      setSubject(''); 
      setType(''); 
      setMessage('');

    } catch (err) {
      console.error('Error submitting form:', err);
      setPopupMessage(`Error submitting form: ${err.message || 'Something went wrong'}`);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);
    }
  };

  const handleStartTour = () => {
    window.__loopStartTourOnHome = true;

    navigate('/home'); 
  };

  return (
    <div className="help-page">
      <Bar currentUser={currentUser} onLogout={onLogout} />

      <div className="help-content">
        
        {/* LEFT: Website explanation */}
        <div className="help-left">
            <h2 className="help-left-title">How does LOOP Work?</h2>

            <button onClick={handleStartTour} className="start-tour-btn">
              View Website Walkthrough Tour
            </button>

            <div className="help-left-section">
                <p className="help-left-desc">
                On the homepage with the map, you can toggle three lists using the buttons: 
                <strong> Events</strong>, <strong>Incidents</strong>, or <strong>All</strong>.
                </p>
            </div>

            <div className="help-left-section">
                <p className="help-left-desc">
                In <strong>Events</strong>, click an event to see its details and associated chat.
                You can upvote or save events.
                </p>
            </div>

            <div className="help-left-section">
                <p className="help-left-desc">
                In <strong>Incidents</strong>, click an incident to view its details and chat. You can upvote incidents but you cannot save them.
                </p>
            </div>

            <div className="help-left-section">
                <p className="help-left-desc">
                In <strong>All</strong>, you see both events and incidents and can participate in the global chat.
                </p>
            </div>

            <div className="help-left-section">
                <p className="help-left-desc">
                On your <strong> profile page</strong>, you can <strong>edit</strong> or <strong>delete</strong> events and incidents you posted, 
                view saved events, and <strong>unsave </strong> events as needed.
                </p>
            </div>
        </div>

        {/* RIGHT: Contact form */}
        <div className="help-right">
          <h1 className="help-title">Contact Us</h1>
          <p className="help-desc">
            Questions? Feedback? Issues?  
            We're here to help—reach out anytime.
          </p>

          <form className="help-form" onSubmit={handleSubmit}>
            <input 
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-box"
              required
            />
            <input 
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-box"
              required
            />
            <input 
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-box"
              required
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-box"
              required
            >
              <option value="" disabled>Select Type</option>
              <option value="Feedback">Feedback</option>
              <option value="Issue">Issue</option>
              <option value="Other">Other</option>
            </select>
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-box textarea-box"
              required
            />
            <button type="submit" className="form-button">Submit</button>
          </form>
        </div>
      </div>
      {showPopup && (
        <div className="popup-message">
          <span>{popupMessage}</span>
          <button className="popup-close" onClick={() => setShowPopup(false)}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default Help;

// citation: chatgpt fixed introTour navigating over to homepage and then starting the tour since the tour starts on the homepage