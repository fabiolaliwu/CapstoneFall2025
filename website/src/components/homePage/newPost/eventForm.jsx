import { useEffect, useState } from 'react';
import './add_post.css';

function EventForm({categoriesFetchStartAsync,currentUser }) {
  const { id } = currentUser || { id: '0' }; // id: 0 is just for testing purpose

  const [eventInfo, setEventInfo] = useState({
    title: '',
    startDate: '',
    endDate: '',
    cost: 'Free', //default
    category: [],
    location: '',
    description: '',
    host: '',
    userid: id
  });
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventTypes, setEventTypes] = useState(['Free', 'Paid']);


  // mapping the category to include emoji to the frontend
  const categoryMap = {
    'Street Fair': '🛍️ Street Fair',
    'Food & Drink': '🍔 Food & Drink',
    'Pop-up': '📍 Pop-up',
    'Concert / Live Music': '🎶 Concert / Live Music',
    'Neighborhood': '🏘️ Neighborhood',
    'Job': '💼 Job',
    'Pet / Animal': '🐕 Pet / Animal',
    'Networking': '🧑‍🤝‍🧑 Networking',
    'Promotions': '🎁 Promotions',
    'Other': 'Other'
  };

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
    const name = e.target.name;
    const value = e.target.value;
  
    setEventInfo((prevInfo) => {
      return { 
        ...prevInfo, 
        [name]: value 
      };
    });
  };  

  //  image file selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
    return true;
  };    


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      // currently using formData to submit multiple data type
      const formData = new FormData();
      
      // Append all event info
      Object.entries(eventInfo).forEach(([key, value]) => {
        if(key === 'category'){
          value.forEach((cat) => formData.append('category', cat));
        }
        else{
          formData.append(key, value);
        }
        
      });
      
      if (image) {
        formData.append('image', image);
      }

      // empty data after submit
      setEventInfo({
        title: '',
        startDate: '',
        endDate: '',
        cost: 'Free',
        category: [],
        location: '',
        description: '',
        host: '',
        userid: id
      });
      setImage(null);
      
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
        <input
          type="text"
          name="location"
          value={eventInfo.location}
          onChange={handleChange}
        />

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


// /**
//  * Citation: 
//https://www.youtube.com/watch?v=tNgbF1s-nZQ
//  */

