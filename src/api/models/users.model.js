import mongoose from "mongoose";
import Club from "./clubs.model.js";
const userSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "student",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    followingClubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club", // Reference to the Club model
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
