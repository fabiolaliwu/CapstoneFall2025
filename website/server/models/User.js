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
  },
  avatar: {
    type: String,
    enum: [
      'avatar1.png',
      'avatar2.png',
      'avatar3.png',
      'avatar4.png',
      'avatar5.png',
      'avatar6.png',
      'avatar7.png',
      'avatar8.png',
    ],
    default: 'avatar8.png'
  }

}, {
  timestamps: true
});

export default mongoose.model("User", UserSchema);