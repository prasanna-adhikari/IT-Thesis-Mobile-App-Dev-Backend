import express from "express";
import {
  addComment,
  addReplyToComment,
  createPost,
  deleteComment,
  deletePost,
  editComment,
  getAllPosts,
  getSinglePost,
} from "../controllers/post.controllers.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const postRouter = express.Router();

// Route to create a new post
postRouter.post("/clubs/:clubId/posts", authenticateToken, createPost);
// Route to get a single post by ID
postRouter.get("/posts/:postId", authenticateToken, getSinglePost);

// Route to get all posts for a club
postRouter.get("/clubs/:clubId/posts", authenticateToken, getAllPosts);

// Route to delete post
postRouter.delete("/posts/:postId", authenticateToken, deletePost);

// Route to add a comment to a post
postRouter.post("/posts/:postId/comments", authenticateToken, addComment);

// Route to update a comment to a post
postRouter.put(
  "/posts/:postId/comments/:commentId",
  authenticateToken,
  editComment
);

// Route to delete a comment from a post
postRouter.delete(
  "/posts/:postId/comments/:commentId",
  authenticateToken,
  deleteComment
);

// Route to add a reply to a comment on a post
postRouter.post(
  "/posts/:postId/comments/:commentId/replies",
  authenticateToken,
  addReplyToComment
);

export default postRouter;
