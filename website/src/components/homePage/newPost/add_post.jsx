import { useState } from 'react';
import './add_post.css';
import EventForm from './eventForm.jsx';
import IncidentForm from './incidentForm';

function AddPost( {currentUser} ) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showForm, setShowForm] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

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

  const handleFormSubmit = () => {
    setShowPopup(true);
    setShowForm(null);
    setTimeout(() => {
      setShowPopup(false);
    }, 5000); // popup disappears after 5 seconds
  }

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
        style={{ width: 170}}
      >
        <span style={{ display: 'inline-block' }}>
          {showForm ? 'Close Form' : 'Add Post ▾'}
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

      {showForm === 'event' && <EventForm onClose={closeForm}  onSubmitSuccess={handleFormSubmit}  currentUser={currentUser}/>}
      {showForm === 'incident' && <IncidentForm onClose={closeForm}  onSubmitSuccess={handleFormSubmit} currentUser={currentUser} />}

      {showPopup && (
        <div className="popup-message">
          <span>Your post has been submitted. Thank you for contributing!</span>
          <button className="popup-close" onClick={() => setShowPopup(false)}>✕</button>

        </div>
      )}
    </div>
  );
}

export default AddPost;



/**
 * Citation: https://medium.com/create-a-clocking-in-system-on-react/handle-form-submissions-in-react-to-a-mongodb-backend-a90cac7c81e9
 */
