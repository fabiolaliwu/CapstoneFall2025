//define schema for user

import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6, // could change
    unique: false,
  },
  role: { // need admin role but to do what idk yet
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, {
  timestamps: true
});

export default mongoose.model("User", UserSchema);