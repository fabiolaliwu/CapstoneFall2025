import { useState } from 'react';
import {useRef, useEffect} from 'react';
import './add_post.css';
import { useLocationInput } from './LocationInput';

function IncidentForm({ currentUser}) {

  const { id } = currentUser || { id: '0' };

  const [incidentInfo, setIncidentInfo] = useState({
    title: '',
    location: '',
    description: '',
    category: [],
    userid: id
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(null);

  const incidentCategories = [
    'Train Delayed',
    'Car Collision', 
    'Fire', 
    'Road Construction',
    'Medical Emergency',
    'Protest',
    'Gun',
    'Crime',
    'Other' ];
  
  // Location input handle
  const { locationInputRef, handleUseMyLocation, isLoaded } = useLocationInput((address) => {
    setIncidentInfo(prev=>({...prev, location:address}));
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncidentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // validate if user input is valid
  const validateForm = () => {
    if (!incidentInfo.title.trim()) {
        alert('Incident title is required');
      return false;
    }
    if (!incidentInfo.location.trim()) {
      alert('Location is required');
      return false;
    }
    if (!incidentInfo.category.length) {
      alert('Please select a category');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
        // append all incident info to formData
        const formData = new FormData();
        Object.entries(incidentInfo).forEach(([key, value]) => {
          if(key==='category'){
            value.forEach((cat) => formData.append('category', cat));
          }
          else{
            formData.append(key, value);
          }
        });
        if (image) formData.append('image', image);
        // !!! TODO: send formData to backend

        setIncidentInfo({
            title: '',
            location: '',
            description: '',
            category: [],
            userid: id
        });
        setImage(null);

        if(locationInputRef.current){
          locationInputRef.current.value = '';
        }
    }catch (err) {
        console.error('Error saving incident:', err);
        alert(`Error saving incident: ${err.message || 'Something went wrong'}`);
    }finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <label>Incident Title <span className="required">*</span></label>
        <input
            type="text"
            name="title"
            value={incidentInfo.title}
            onChange={handleChange}
            required
        />

        <label>Location <span className="required">*</span></label>
        {isLoaded ? (
          <>
            <input ref={locationInputRef} type="text" placeholder="Enter location or use my location" onChange={handleChange} />
            <button type="button" onClick={handleUseMyLocation}>Use My Location</button>
          </>
        ) : (
          <input
            type="text"
            name="location"
            required
            style={{ width: "305px", padding: "10px" }}
            placeholder="Loading Google Maps..."
            disabled
          />
        )}
        <p className="reminder">Reminder: only available in NYC</p>

        <label>Category <span className="required">*</span></label>
        <div className="category-toggle">
          {incidentCategories.map((cat) => (
            <button
                key={cat}
                type="button"
                className={incidentInfo.category[0] === cat ? 'selected' : ''}
                onClick={() => setIncidentInfo((prev) => ({ ...prev, category: [cat] }))}
            >
            {cat}
            </button>
          ))}
        </div>
        <p>Selected category: {incidentInfo.category[0] || 'None'}</p>

        <label>Description</label>
        <input
            type="text"
            name="description"
            value={incidentInfo.description}
            maxLength={300}
            onChange={handleChange}
        />

        <label>Image</label>
        <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
        />

        <button type="submit" disabled={isSubmitting}> {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default IncidentForm;
