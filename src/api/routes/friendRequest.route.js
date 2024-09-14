import express from "express";

import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "../controllers/friendRequest.controller.js";

const friendRequestRouter = express.Router();

// Route to send a friend request
friendRequestRouter.post(
  "/friend-request/:recipientId",
  authenticateToken,
  sendFriendRequest
);

// Route to accept a friend request
friendRequestRouter.post(
  "/friend-request/:requestId/accept",
  authenticateToken,
  acceptFriendRequest
);

// Route to reject a friend request
friendRequestRouter.post(
  "/friend-request/:requestId/reject",
  authenticateToken,
  rejectFriendRequest
);

// Route to remove a friend
friendRequestRouter.delete(
  "/friend/:friendId/remove",
  authenticateToken,
  removeFriend
);

export default friendRequestRouter;
