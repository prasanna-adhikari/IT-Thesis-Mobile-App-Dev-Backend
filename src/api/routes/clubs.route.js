// routes/clubRoutes.js

import express from "express";

import {
  createClub,
  deleteClub,
  searchClubs,
  updateClub,
  viewAllClubs,
  viewSingleClub,
} from "../controllers/clubs.controllers.js";
import {
  authenticateToken,
  isAdmin,
  isClubAdmin,
} from "../middleware/auth.middleware.js";
import { validateClubBody } from "../middleware/club.middleware.js";
import upload from "../middleware/upload.middleware.js";

const clubRouter = express.Router();

// Route to create a club
clubRouter.post(
  "/club",
  authenticateToken,
  isClubAdmin,
  upload.single("clubImage"),
  validateClubBody,
  createClub
);

clubRouter.post(
  "/update-club/:clubId",
  authenticateToken,
  upload.single("clubImage"),
  isAdmin,
  updateClub
);

clubRouter.delete(
  "/delete-club/:clubId",
  authenticateToken,
  isAdmin,
  deleteClub
);

clubRouter.get("/clubs/:id", authenticateToken, viewSingleClub);
clubRouter.get("/clubs", authenticateToken, viewAllClubs);

// Route to search clubs by query (name or description) with pagination
clubRouter.get("/search-clubs", authenticateToken, searchClubs);

export default clubRouter;
