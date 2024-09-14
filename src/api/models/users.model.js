import mongoose from "mongoose";

// Define the allowed roles using an enum
const rolesEnum = ["student", "club_admin", "admin", "superuser"];

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
      enum: rolesEnum, // Enum for roles
      required: true,
      default: "student", // Default role
    },
    verified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String, // Path to the user's profile image file
    },
    followingClubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club", // Reference to the Club model
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // Reference to the Post model
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to other users
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
