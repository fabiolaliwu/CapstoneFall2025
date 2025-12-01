import { useEffect, useState } from 'react';
import './add_post.css';
import { useLocationInput } from './LocationInput.jsx';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const safeBaseUrl = API_BASE_URL.replace(/\/$/, ''); // Ensures no double slash

function EventForm({categoriesFetchStartAsync,currentUser , onSubmitSuccess}) {
  const [categories, setCategories] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventTypes] = useState(['Free', 'Paid']);

  const [eventInfo, setEventInfo] = useState({
    title: '',
    startDate: '',
    endDate: '',
    cost: 'Free', //default
    category: [],
    location: {
      address: '',
      coordinates: { lat: 0, lng: 0 }
    },
    description: '',
    host: '',
    userId: currentUser?._id || ''
  });

  // mapping the category to include emoji to the frontend
  const categoryMap = {
    'Street Fair': '🛍️ Street Fair',
    'Food & Drink': '🍔 Food & Drink',
    'Pop-up': '📍 Pop-up',
    'Networking': '🧑‍🤝‍🧑 Networking',
    'Concert / Live Music': '🎶 Concert / Live Music',
    'Neighborhood': '🏘️ Neighborhood',
    'Job': '💼 Job',
    'Sports': '🎽 Sports',
    'Pet / Animal': '🐕 Pet / Animal',
    'Promotions': '🎁 Promotions',
    'Education': '📚 Education',
    'Other': 'Other'
  };

  // set user id when currentUser load
  useEffect(() => {
    if (currentUser?._id) {
      setEventInfo(prev => ({ ...prev, userId: currentUser?._id }));
    }
    
  }, [currentUser]);

  // Location input autofill
  const { locationInputRef, handleUseMyLocation, isLoaded } = useLocationInput((address, coordinates) => {
    setEventInfo(prev => ({
      ...prev, 
      location: {
        address: address,
        coordinates: coordinates || { lat: 40.7128, lng: -74.0060 } // fallback to NYC coord
      }
    }));
  });

  // Fetch the categories from server 
  useEffect(() => {
    const loadCategories = async () => {
      let cats = [];
      if (categoriesFetchStartAsync) {
        cats = await categoriesFetchStartAsync();
        if (!Array.isArray(cats)) cats = cats?.data || [];
      }
      // if no categories from server, use default
      if (cats.length === 0) {
        cats = Object.keys(categoryMap); // fallback
      }
      setCategories(cats);
    };
    loadCategories();
  }, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "location") {
      setEventInfo((prev) => ({
        ...prev, 
        location: {
          ...prev.location,
          address: value
        }
      }));
    } else {
      setEventInfo((prev) => ({ ...prev, [name]: value }) );
    }
  };

  //  image file selection
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

  // Validate the form is filled out correctly
  const validateForm = () => {
    if (!eventInfo.title.trim()) {
      alert('Event title is required');
      return false;
    }
    if (eventInfo.endDate && new Date(eventInfo.endDate) <= new Date(eventInfo.startDate)) {
      alert('End date must be after start date');
      return false;
    }
    if(!eventInfo.location.address.trim()) {
      alert('Location is required');
      return false;
    }
    if (!eventInfo.category.length) {
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
      const dataToSend = {
        title: eventInfo.title,
        description: eventInfo.description,
        start_date: eventInfo.startDate, 
        end_date: eventInfo.endDate,   
        cost: eventInfo.cost,
        location: eventInfo.location,
        category: eventInfo.category,
        host: eventInfo.host,
        user_id: eventInfo.userId,    
        image: imageData || ''
      };

      const response = await fetch(`${safeBaseUrl}/api/events`, {
        method: "POST",
        headers: {
            // Must specify content type for JSON body
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${localStorage.getItem('token')}` // JWS autorization
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

      // empty data after submit
      setEventInfo({
        title: '',
        startDate: '',
        endDate: '',
        cost: 'Free',
        category: [],
        location: {
          address: '',
          coordinates: { lat: 0, lng: 0 }
        },
        description: '',
        host: '',
        userId: currentUser?._id || ''
      });
      setImageData(null);
      if(locationInputRef.current){
        locationInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error saving event:', err);
      const message = err?.response?.data?.message || err.message || 'Something went wrong';
      alert(`Error saving event: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // This script is how form displayed on the page
  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <label>Event Title
          <span className="required">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={eventInfo.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <input
          type="text"
          name="description"
          value={eventInfo.description}
          maxLength={300}
          onChange={handleChange}
        />

        <label>Start DateTime
          <span className="required">*</span>
        </label>
        <input
          type="datetime-local"
          name="startDate"
          value={eventInfo.startDate}
          onChange={handleChange}
          required
        />

        <label>End DateTime</label>
        <input
          type="datetime-local"
          name="endDate"
          value={eventInfo.endDate}
          onChange={handleChange}
        />

        <label>Cost
        </label>
        <div className='cost-toggle'>
          {eventTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={eventInfo.cost === type ? 'selected' : ''}
              onClick={() => setEventInfo((prev) => ({ ...prev, cost: type }))}
            >
              {type}
            </button>
          ))}
        </div>


        <label>Location
          <span className="required">*</span>
        </label>
        {isLoaded ? (
          <>
            <input
              ref={locationInputRef}
              name="location"
              type="text"
              placeholder="Enter location or use my location"
            />
            <button type="button" className="my-location-btn" onClick={handleUseMyLocation}>
              Use My Location
            </button>
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
          Selected address: {eventInfo.location.address || 'None'}
        </p>

        <label>Organiser</label>
        <input
          type="text"
          name="host"
          value={eventInfo.host}
          onChange={handleChange}
        />

        <label>Category
          <span className="required">*</span>
        </label>
        <div className="category-toggle">
          {categories.map((cat) => {
            const isSelected = eventInfo.category.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                className={isSelected ? 'selected' : ''}
                onClick={() => {
                  setEventInfo((prev) => {
                    const newCategories = isSelected
                      ? prev.category.filter((c) => c !== cat)
                      : [...prev.category, cat];
                    return { ...prev, category: newCategories };
                  });
                }}
              >
                {categoryMap[cat] || cat}
              </button>
            );
          })}
        </div>

        <p>
          Selected categories:{' '}
          {eventInfo.category.map((cat) => categoryMap[cat] || cat).join(', ')}
        </p>

        <label>Image</label>
        <input
        className="image-file"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

    </div>

  );
}

export default EventForm;