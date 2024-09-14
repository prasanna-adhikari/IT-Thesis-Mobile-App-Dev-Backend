import express from "express";
import { getChatHistory } from "../controllers/chat.controllers.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const chatRouter = express.Router();

// Route to get chat history between two users
chatRouter.get("/chat/:friendId", authenticateToken, getChatHistory);

export default chatRouter;
