import express from "express";
import {
  addComment,
  addReplyToComment,
  createEventPost,
  createPost,
  createUserPost,
  deleteComment,
  deleteEventPost,
  deletePost,
  deleteReply,
  deleteUserPost,
  editComment,
  getAllClubPosts,
  getAllPosts,
  getAllUserPosts,
  getSinglePost,
  markGoingToEvent,
  markInterestInEvent,
  updateEventPost,
  updatePost,
  updateReply,
  updateUserPost,
} from "../controllers/post.controllers.js";
import {
  authenticateToken,
  isAdmin,
  isClubAdmin,
} from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const postRouter = express.Router();

// Route to create a new post
postRouter.post(
  "/clubs/:clubId/posts",
  authenticateToken,
  upload.array("media", 10),
  createPost
);
// Route to create a new post by user
postRouter.post(
  "/user/:userId/posts",
  authenticateToken,
  upload.array("media", 10),
  createUserPost
);
// Route to get a single post by ID
postRouter.get("/posts/:postId", authenticateToken, getSinglePost);

// Route to get all posts for a club
postRouter.get("/clubs/:clubId/posts", authenticateToken, getAllClubPosts);

// get all post
postRouter.get("/posts", authenticateToken, getAllPosts);

// Route to get all posts for a user
postRouter.get("/user/:userId/posts", authenticateToken, getAllUserPosts);

// Route to delete post
postRouter.delete("/posts/:postId", authenticateToken, deletePost);

// Route to add a comment to a post
postRouter.post(
  "/posts/:postId/comments",
  authenticateToken,
  upload.array("media", 3),
  addComment
);

// Route to update a comment to a post
postRouter.put(
  "/posts/:postId/comments/:commentId",
  authenticateToken,
  upload.array("media", 3),
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
  upload.array("media", 3),
  addReplyToComment
);

// Route to create an event post
postRouter.post(
  "/clubs/:clubId/event",
  authenticateToken,
  isAdmin,
  upload.array("media", 10),
  createEventPost
);

// Route to mark interest in an event
postRouter.post(
  "/posts/:postId/event/interested",
  authenticateToken,
  markInterestInEvent
);

// Route to mark going to an event
postRouter.post(
  "/posts/:postId/event/going",
  authenticateToken,
  markGoingToEvent
);
// Update regular post
postRouter.put("/posts/:postId", upload.array("media", 10), updatePost);

// Update event post
postRouter.put(
  "/events/:postId",
  isClubAdmin,
  upload.array("media", 10),
  updateEventPost
);
// delete event post
postRouter.delete("/events/:postId", isAdmin, deleteEventPost);
export default postRouter;

// Delete reply
postRouter.delete(
  "/posts/:postId/comments/:commentId/replies/:replyId",
  authenticateToken,
  deleteReply
);

// update reply
postRouter.put(
  "/posts/:postId/comments/:commentId/replies/:replyId",
  authenticateToken,
  upload.array("media", 3),
  updateReply
);

// Route to get all posts for a user
postRouter.delete("/user/:userId/posts", authenticateToken, deleteUserPost);

// Route to update all posts for a user
postRouter.put("/user/:userId/posts", authenticateToken, updateUserPost);
