import mongoose from "mongoose";

// define schema for Event
const EventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    maxLength: 100
  },
  description: {
    type: String,
    maxLength: 300,
    default: ""
  },
  start_date: { 
    type: Date, 
    required: true
  },
  end_date: { 
    type: Date,
    required: true
  },
  cost: { 
    type: String, 
    enum: ['Free', 'Paid'], 
    default: 'Free'
  },
  category: {
    type: [String],
    default: 'Other',
    enum:['Street Fair','Food & Drink','Pop-up', 'Concert / Live Music','Neighborhood','Job','Pet / Animal','Networking','Promotions','Sports','Education','Other'],
    required: true
  },
  location: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  host: {
    type: String,
    default: ""
  },
  user_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  image: {
    type: String,
    default: ""
  }
}, { 
  timestamps: true 
});

// autodelete events after 7days of end_date
EventSchema.index(
  { end_date: 1 }, 
  { expireAfterSeconds: 7 * 24 * 60 * 60 },
);

export default mongoose.model("Event", EventSchema);