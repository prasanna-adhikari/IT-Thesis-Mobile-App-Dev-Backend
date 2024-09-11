// routes/clubRoutes.js

import express from "express";

import {
  createClub,
  deleteClub,
  updateClub,
  viewAllClubs,
  viewSingleClub,
} from "../controllers/clubs.controllers.js";
import { authenticateToken, isAdmin } from "../middleware/auth.middleware.js";
import { validateClubBody } from "../middleware/club.middleware.js";

const clubRouter = express.Router();

// Route to create a new club
clubRouter.post(
  "/create-club",
  authenticateToken,
  isAdmin,
  validateClubBody,
  createClub
);

clubRouter.post("/update-club/:clubId", authenticateToken, isAdmin, updateClub);
clubRouter.delete(
  "/delete-club/:clubId",
  authenticateToken,
  isAdmin,
  deleteClub
);

clubRouter.get("/clubs/:id", authenticateToken, viewSingleClub);
clubRouter.get("/clubs", authenticateToken, viewAllClubs);

export default clubRouter;
