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
    default: "",
    enum:['Train Delayed', 'Car Collision', 'Fire', 'Road Construction', 'Medical Emergency', 'Protest', 'Gun','Crime', 'Other']

  },
  location: {
    type: String,
    default: "",
    required:true
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

export default mongoose.model("Incident", IncidentSchema);
