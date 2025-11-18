import { useState, useEffect } from 'react';
import './add_post.css';
import { useLocationInput } from './LocationInput';

function IncidentForm({ currentUser, onSubmitSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageData, setImageData] = useState(null);

  const [incidentInfo, setIncidentInfo] = useState({
    title: '',
    location: {
      address: '',
      coordinates: { lat: 0, lng: 0 }
    },
    description: '',
    category: [],
    train_line: [],
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

  // Train color for each line
  const trainMap = {
    '1': '#D82233','2': '#D82233','3': '#D82233','4': '#009952','5': '#009952',
    '6': '#009952','A': '#0062CF','C': '#0062CF','E': '#0062CF','7': '#9A38A1',
    'B': '#EB6800','D': '#EB6800','F': '#EB6800','M': '#EB6800','G': '#6CBE45',
    'N': '#F6BC26','Q': '#F6BC26','R': '#F6BC26','W': '#F6BC26','L': '#AAAAAA',
    'S': '#808080','J': '#8E5C33','Z': '#8E5C33'
  };

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
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageData(reader.result); 
        };
        reader.readAsDataURL(file); 
    } else {
        setImageData(null);
    }
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
        const dataToSend = {
          title: incidentInfo.title,
          description: incidentInfo.description,
          start_date: incidentInfo.startDate, 
          end_date: incidentInfo.endDate,   
          cost: incidentInfo.cost,
          location: incidentInfo.location,
          category: incidentInfo.category[0],
          host: incidentInfo.host,
          user_id: incidentInfo.userId,    
          image: imageData || '',
          train_line: incidentInfo.train_line
        };

        // send POST request to server
        const response = await fetch("http://localhost:4000/api/incidents", {
          method: "POST",
          headers: {
            // Must specify content type for JSON body
            "Content-Type": "application/json", 
          },
          body: JSON.stringify(dataToSend), // Send JSON body
        });
        if (!response.ok) {
          const resText = await response.text(); // get response text to debug
          throw new Error(`Failed to submit event: ${resText}`);
        }
        const data = await response.json();
        console.log("Event created:", data);
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
            train_line: [],
            userId: currentUser?._id || ''
        });
        setImageData(null);

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
            <button type="button" className="my-location-btn" onClick={handleUseMyLocation}>Use My Location</button>
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
        <p style={{ color: '#666', marginTop: '-1px' }}>
          Selected address: {incidentInfo.location.address || 'None'}
        </p>

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
        {incidentInfo.category[0] === 'Train Delayed' && (
          <>
            <label>Train Line(s)</label>
            <div className="train-line-grid">
              {Object.keys(trainMap).map((line) => (
                <button
                  key={line}
                  type="button"
                  className={`train-line-option ${incidentInfo.train_line.includes(line) ? 'selected' : ''}`}
                  style={{
                    backgroundColor: trainMap[line] || '#000000',
                    color: (line === 'N' || line === 'R' ||  line === 'Q' ||  line === 'W')? '#000000' : '#FFFFFF' 
                }}
                  onClick={() =>
                    // toggle train line selection
                    setIncidentInfo((prev) => ({
                      ...prev,
                      train_line: prev.train_line.includes(line)
                        ? prev.train_line.filter((l) => l !== line)
                        : [...prev.train_line, line],
                    }))
                  }
                >
                  {line}
                </button>
              ))}
            </div>
          </>
        )}

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
            className="image-file"
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
