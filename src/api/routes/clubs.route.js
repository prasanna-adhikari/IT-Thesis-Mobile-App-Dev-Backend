// routes/clubRoutes.js

import express from "express";

import { createClub } from "../controllers/clubs.controllers.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { validateClubBody } from "../middleware/club.middleware.js";

const clubRouter = express.Router();

// Route to create a new club
clubRouter.post(
  "/create-clubs",
  authenticateToken,
  validateClubBody,
  createClub
);

export default clubRouter;
