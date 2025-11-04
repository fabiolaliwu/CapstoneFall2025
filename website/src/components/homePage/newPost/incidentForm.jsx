import { useState, useEffect } from 'react';
import './add_post.css';
import { useLocationInput } from './LocationInput';

function IncidentForm({ currentUser, onSubmitSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(null);

  const [incidentInfo, setIncidentInfo] = useState({
    title: '',
    location: {
      address: '',
      coordinates: { lat: 0, lng: 0 }
    },
    description: '',
    category: [],
    userId: currentUser?._id || ''
  });

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

  // set user id when currentUser load
  useEffect(() => {
    if (currentUser?._id) {
      setIncidentInfo(prev => ({ ...prev, userId: currentUser._id }) );
    }
    
  }, [currentUser]);
  
  // Location input handle
  const { locationInputRef, handleUseMyLocation, isLoaded } = useLocationInput((address, coordinates) => {
    setIncidentInfo(prev => ({
      ...prev, 
      location: {
        address: address,
        coordinates: coordinates || { lat: 40.7128, lng: -74.0060 } // fallback to NYC coord
      }
    }));
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "location") {
      setIncidentInfo((prev) => ({ 
        ...prev, 
        location: {
          ...prev.location,
          address: value
        }
      }));
    } else {
      setIncidentInfo((prev) => ({ ...prev, [name]: value }));
    }
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
    if (!incidentInfo.location.address.trim()) {
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
        formData.append("title", incidentInfo.title);
        formData.append("location", JSON.stringify(incidentInfo.location));
        formData.append("description", incidentInfo.description)
        formData.append('user_id', currentUser._id);

        formData.append("category", incidentInfo.category[0] || "");
        if (image) formData.append("image", image);  

        // send POST request to server
        const response = await fetch("http://localhost:4000/api/incidents", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Failed to submit incident");

        onSubmitSuccess();
        
        // Reset form to default state
        setIncidentInfo({
            title: '',
            location: {
              address: '',
              coordinates: { lat: 0, lng: 0 }
            },
            description: '',
            category: [],
            userId: currentUser?._id || ''
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
            <input
              ref={locationInputRef}
              name="location"
              type="text"
              placeholder="Enter location or use my location"
            />
            <button type="button" onClick={handleUseMyLocation}>Use My Location</button>
          </>
        ) : (
          <input
            ref={locationInputRef}
            type="text"
            name="location"
            required
            style={{ width: "305px", padding: "10px" }}
            placeholder="Loading Google Maps..."
            disabled
          />
        )}
        <p className="reminder">Reminder: only available in NYC</p>
        <p>Selected address: {incidentInfo.location.address || 'None'}</p>

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
