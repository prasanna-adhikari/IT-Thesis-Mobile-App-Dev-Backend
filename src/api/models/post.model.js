import mongoose from "mongoose";

// Reply Schema
const replySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  media: {
    type: [String], // Array to store paths/URLs of media files in replies
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Comment Schema
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  media: {
    type: [String], // Array to store paths/URLs of media files in comments
  },
  replies: [replySchema], // Nested replies
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Post Schema
const postSchema = new mongoose.Schema({
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  media: {
    type: [String], // Array to store paths/URLs of media files in posts
  },
  isEvent: {
    type: Boolean,
    default: false, // Whether the post is an event or not
  },
  eventDetails: {
    eventName: { type: String },
    eventDate: { type: Date }, // Date and time of the event
    location: { type: String },
    interested: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users interested in the event
    going: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users going to the event
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who liked the post
  shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who shared the post
  comments: [commentSchema], // Nested comments with media support
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Post model
const Post = mongoose.model("Post", postSchema);
export default Post;
