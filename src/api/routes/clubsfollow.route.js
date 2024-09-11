import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  followClub,
  getFollowedClubs,
  unfollowClub,
} from "../controllers/clubFollow.controllers.js";

const clubFollorRouter = express.Router();

clubFollorRouter.post("/follow/:clubId", authenticateToken, followClub);
clubFollorRouter.post("/unfollow/:clubId", authenticateToken, unfollowClub);
clubFollorRouter.get("/followed-clubs", authenticateToken, getFollowedClubs);

export default clubFollorRouter;
