import { useState } from 'react';
import './add_post.css';
import EventForm from './eventForm.jsx';
import IncidentForm from './incidentForm';

function AddPost( {currentUser} ) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showForm, setShowForm] = useState(null);

  // toggle dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // open the form when click the item
  const openForm = (formType) => {
    setShowForm(formType); // show selected form
    setShowDropdown(false); // close dropdown
  };

  // close form
  const closeForm = () => {
    setShowForm(null);
  };

  return (
    <div className="add">
      <button
        className="add-btn"
        //if the form is open, click the button to close the form
        onClick={() => {
          if (showForm){
            closeForm();
          }
          else{
            toggleDropdown();
          }
        }}
        style={{ width: 160}}
      >
        <span style={{ display: 'inline-block', color: 'rgb(66, 66, 66)' }}>
          {showForm ? 'Close Form' : '+ Add Post ▾'}
        </span>
      </button>
      
      {showDropdown && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={() => openForm('event')}>
            Add Event
          </button>
          <button className="dropdown-item" onClick={() => openForm('incident')}>
            Add Incident
          </button>
        </div>
      )}

      {showForm === 'event' && <EventForm onClose={closeForm}  currentUser={currentUser}/>}
      {showForm === 'incident' && <IncidentForm onClose={closeForm} currentUser={currentUser} />}
      
    </div>
  );
}

export default AddPost;



/**
 * Citation: https://medium.com/create-a-clocking-in-system-on-react/handle-form-submissions-in-react-to-a-mongodb-backend-a90cac7c81e9
 */
