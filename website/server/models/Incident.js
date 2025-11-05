import mongoose from "mongoose";

// define schema for incident
const IncidentSchema = new mongoose.Schema({
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

  category: {
    type: String,
    default: 'Other',
    enum:['Train Delayed', 'Car Collision', 'Fire', 'Road Construction', 'Medical Emergency', 'Protest', 'Gun','Crime', 'Other']
  },
  location: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  user_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true 
  },
  image_url: {
    type: String,
    default: ""
  }
}, { 
  timestamps: true 
});

export default mongoose.model("Incident", IncidentSchema);
