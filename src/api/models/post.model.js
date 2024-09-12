import mongoose from "mongoose";

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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

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
  replies: [replySchema], // Nested replies
  created_at: {
    type: Date,
    default: Date.now,
  },
});

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
  created_at: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Track who liked the post
    },
  ],
  shares: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Track who shared the post
    },
  ],
  comments: [commentSchema], // Embed comments inside the post
});

const Post = mongoose.model("Post", postSchema);
export default Post;
