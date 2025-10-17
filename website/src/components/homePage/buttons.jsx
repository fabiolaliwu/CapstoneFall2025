import './buttons.css';

function Buttons({ openEvents, openSummary, openIncidents, openMessages }) {
  return (
    <div className="all-buttons">
      <button 
        onClick={openEvents} 
        className="event-btn"
      >Events</button>

      <button 
        onClick={openSummary} 
        className="summary-btn"
      >Summary</button>

      <button 
        onClick={openIncidents} 
        className="incident-btn"
      >Incidents</button>

      <button 
        onClick={openMessages} 
        className="message-btn"
      > Chat
      </button>
    </div>
  );
}

export default Buttons;