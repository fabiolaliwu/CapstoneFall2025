import mongoose from "mongoose";


// define schema for Event
const EventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    maxLength: 100,
    required: true
  },
  description: {
    type: String,
    maxLength: 300,
    default: ""
  },
  startDate: { 
    type: Date, 
    required: true
  },
  endDate: { 
    type: Date,
    default: null
  },
  cost: { 
    type: String, 
    enum: ['Free', 'Paid'], 
  },
  category: {
    type: String,
    default: "",
    enum:['Street Fair','Food & Drink','Pop-up', 'Concert / Live Music','Neighborhood','Job','Pet / Animal','Networking','Promotions','Other'],

  },
  location: {
    type: String,
    default: ""
  },
  host: {
    type: String,
    default: ""
  },
  userId:{
    type: String, 
    required: true 
  },
  imageUrl: {
    type: String,
    default: ""
  }
}, { 
  timestamps: true 
});

export default mongoose.model("Event", EventSchema);