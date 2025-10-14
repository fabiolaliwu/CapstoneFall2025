import './buttons.css';

function Buttons({ openEvents, openSummary, openIncidents }) {
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
    </div>
  );
}

export default Buttons;