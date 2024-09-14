// routes/clubRoutes.js

import express from "express";

import {
  createClub,
  deleteClub,
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
  "/clubs",
  authenticateToken,
  isAdmin,
  validateClubBody,
  upload.single("clubImage"),
  createClub
);

clubRouter.post(
  "/update-club/:clubId",
  authenticateToken,
  isAdmin,
  upload.single("clubImage"),
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

export default clubRouter;
