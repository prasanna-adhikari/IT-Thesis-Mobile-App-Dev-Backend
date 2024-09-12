import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { getNewsfeed } from "../controllers/newsfeed.controllers.js";

const newsfeedRouter = express.Router();

// Route to get the user's newsfeed
newsfeedRouter.get("/newsfeed", authenticateToken, getNewsfeed);

export default newsfeedRouter;
