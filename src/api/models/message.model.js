import mongoose from "mongoose";

// Define the Message schema
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  media: {
    type: [String], // Optional: store media file paths if needed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Message model
const Message = mongoose.model("Message", messageSchema);
export default Message;
