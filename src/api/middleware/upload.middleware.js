import mongoose from "mongoose";

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
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
  clubImage: {
    type: String, // To store the image file path
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Club = mongoose.model("Club", clubSchema);

export default Club;
