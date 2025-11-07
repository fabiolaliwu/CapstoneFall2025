import './buttons.css';
// Import icons (example)
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoBarChartSharp } from "react-icons/io5";
import { IoWarningOutline } from "react-icons/io5";

function Buttons({ openEvents, openSummary, openIncidents }) {
  return (
    <div className="all-buttons">
      
      <button onClick={openEvents}>
        <FaRegCalendarAlt size={20} />
        <span className="btn-text">Events</span>
      </button>

      <button onClick={openSummary}>
        <IoBarChartSharp size={20} />
        <span className="btn-text">Summary</span>
      </button>

      <button onClick={openIncidents}>
        <IoWarningOutline size={20} />
        <span className="btn-text">Incidents</span>
      </button>

    </div>
  );
}
export default Buttons;