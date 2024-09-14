import mongoose from "mongoose";
import Post from "./post.model.js"; // Import the Post model

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
  },
  clubImage: {
    type: String, // Path to the user's profile image file
  },
  admin_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Reference to the Post model
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const Club = mongoose.model("Club", clubSchema);

export default Club;
