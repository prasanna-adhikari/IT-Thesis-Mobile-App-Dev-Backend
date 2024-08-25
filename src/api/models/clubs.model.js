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
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This references the User model
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const Club = mongoose.model("Club", clubSchema);

export default Club;
