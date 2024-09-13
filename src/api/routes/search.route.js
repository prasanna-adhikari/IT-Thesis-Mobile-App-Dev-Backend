import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { search } from "../controllers/search.controllers.js";

const searchRouter = express.Router();

// Route to search users, clubs, and posts
searchRouter.get("/search", authenticateToken, search);

export default searchRouter;
