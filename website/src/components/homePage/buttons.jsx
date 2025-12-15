import './buttons.css';
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoGlobeOutline } from "react-icons/io5";
import { IoWarningOutline } from "react-icons/io5";

function Buttons({ openEvents, openSummary, openIncidents }) {
  return (
    <div className="all-buttons">
      
      <button id="events-button" onClick={openEvents}>
        <FaRegCalendarAlt size={20} />
        <span className="btn-text">Events</span>
      </button>

      <button id="incidents-button" onClick={openIncidents}>
        <IoWarningOutline size={20} />
        <span className="btn-text">Incidents</span>
      </button>

      <button id="all-button" onClick={openSummary}>
        <IoGlobeOutline size={20} />
        <span className="btn-text">All</span>
      </button>

    </div>
  );
}
export default Buttons;