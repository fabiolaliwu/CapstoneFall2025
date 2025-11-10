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
  train_line:{
    type: [String],
    default: 'N/A',
    enum:['1','2','3','4','5','6','7','A','B','C','D','E','F','G','J','L','M','N','Q','R','S','W','Z','N/A']
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

// TTL index to auto-delete incidents after 5days
IncidentSchema.index(
  { createdAt: 1 }, 
  { expireAfterSeconds: 5 * 24 * 60 * 60 } // 5 (days) * 24 (hrs) * 60 (mins) * 60 (secs)
);

export default mongoose.model("Incident", IncidentSchema);
