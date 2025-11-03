//define schema for user

import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.UUID, // use UUID for user IDs
    default: () => mongoose.Types.UUID(),
  },
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