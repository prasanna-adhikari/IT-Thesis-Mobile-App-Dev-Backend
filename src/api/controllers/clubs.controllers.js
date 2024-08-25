// controllers/clubController.js

import Club from "../models/clubs.model.js";
import User from "../models/users.model.js";

export const createClub = async (req, res) => {
  try {
    const { name, description } = req.body;
    const user = req.currentUser._id; // Assuming admin_id is provided by authenticateToken middleware
    const admin_id = user._id;

    // Create a new club
    const newClub = new Club({
      name,
      description,
      admin_id: admin_id, // Link the club to the admin user
    });

    await newClub.save();

    return res.status(201).json({
      status: "Success",
      message: "Club created successfully.",
      systemMessage: "",
      result: newClub,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failure",
      message: "An error occurred while creating the club.",
      systemMessage: error.message,
    });
  }
};
