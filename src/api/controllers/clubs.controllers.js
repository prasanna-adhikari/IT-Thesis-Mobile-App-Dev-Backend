// controllers/clubController.js
import { trimObject } from "../utilities/helper.utilities.js";
import Club from "../models/clubs.model.js";
import mongoose from "mongoose";
import User from "../models/users.model.js";
export const createClub = async (req, res) => {
  try {
    let { name, description } = req.body;
    const user = req.currentUser;

    // Use trimObject to remove unnecessary spaces from the input fields
    const trimmedData = trimObject({ name, description });
    name = trimmedData.name;

    // Check if a club with the same name already exists
    const existingClub = await Club.findOne({ name: name });
    if (existingClub) {
      return res.status(400).json({
        status: "Failure",
        message: "Club name already exists. Please choose a different name.",
        systemMessage: "",
      });
    }

    // Handle the image upload, if it exists
    let clubImage = null;
    if (req.file) {
      clubImage = req.file.path; // Store the file path in the clubImage variable
    }

    console.log(req.file);

    // Create a new club
    const newClub = new Club({
      name,
      description: trimmedData.description,
      admin_id: user._id,
      created_at: new Date(),
      clubImage, // Add the image path to the club model
    });

    await newClub.save();

    return res.status(201).json({
      status: "Success",
      message: "Club created successfully.",
      systemMessage: "",
      result: newClub,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Failure",
      message: "An error occurred while creating the club.",
      systemMessage: error.message,
    });
  }
};

// delete club
export const deleteClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    // Find and delete the club
    const deletedClub = await Club.findByIdAndDelete(clubId);

    if (!deletedClub) {
      return res.status(404).json({
        status: "Failure",
        message: "Club not found.",
        systemMessage: "",
      });
    }

    // Fetch the remaining clubs
    const remainingClubs = await Club.find({}); // Assuming you want all remaining clubs

    return res.status(200).json({
      status: "Success",
      message: "Club deleted successfully.",
      systemMessage: "",
      result: {
        deletedClub, // The club that was deleted
        remainingClubs, // All remaining clubs after deletion
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "Failure",
      message: "An error occurred while deleting the club.",
      systemMessage: error.message,
    });
  }
};

// update club
// export const updateClub = async (req, res) => {
//   const { id } = req.params.clubId; // Get club ID from URL params
//   const { name, description } = req.body; // Get club details from request body

//   console.log(req.params.clubId);

//   try {
//     // Find the club by ID and update it
//     const updatedClub = await Club.findByIdAndUpdate(
//       id,
//       { name, description },
//       { new: true, runValidators: true }
//     );

//     if (updatedClub) {
//       return res.status(200).json({
//         success: true,
//         message: "Club updated successfully.",
//         developerMessage: "",
//         result: updatedClub,
//       });
//     } else {
//       return res.status(404).json({
//         success: false,
//         message: "Club not found.",
//         developerMessage: "",
//         result: [],
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update club.",
//       developerMessage: error.message,
//       result: [],
//     });
//   }
// };

export const updateClub = async (req, res) => {
  const { clubId } = req.params; // Get club ID from URL params
  const { name, description, admin_id } = req.body; // Get club details from request body

  try {
    // Find the club by ID
    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found.",
        developerMessage: "",
        result: [],
      });
    }

    // Update name and description if provided
    if (name) club.name = name;
    if (description) club.description = description;

    // Update admin_id if provided
    if (admin_id) {
      // Fetch the user to verify if they have an admin role
      const user = await User.findById(admin_id);

      if (!user || user.role !== "admin") {
        return res.status(400).json({
          success: false,
          message: "Only users with the admin role can be added as an admin.",
          developerMessage: "",
          result: [],
        });
      }

      // Add or remove admin_id
      const adminIndex = club.admin_id.indexOf(admin_id);

      if (adminIndex === -1) {
        // Add admin_id if not already present
        club.admin_id.push(admin_id);
      } else {
        // Remove admin_id if present
        club.admin_id.splice(adminIndex, 1);
      }

      // Ensure there's at least one admin_id
      if (club.admin_id.length === 0) {
        return res.status(400).json({
          success: false,
          message: "There must be at least one admin.",
          developerMessage: "",
          result: [],
        });
      }
    }

    // Handle the image upload, if it exists
    if (req.file) {
      club.clubImage = req.file.path; // Update club image with the uploaded file path
    }

    // Save the updated club
    await club.save();

    return res.status(200).json({
      success: true,
      message: "Club updated successfully.",
      developerMessage: "",
      result: club,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update club.",
      developerMessage: error.message,
      result: [],
    });
  }
};

// view all clubs

export const viewAllClubs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // Default limit to 10

  try {
    // Fetch all clubs with pagination
    const clubs = await Club.find()
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .limit(limit);

    // Count total clubs in the collection
    const totalClubs = await Club.countDocuments();

    // Fetch followers count for each club
    const clubsWithFollowers = await Promise.all(
      clubs.map(async (club) => {
        // Fetch followers count
        const followersCount = await User.countDocuments({
          followingClubs: club._id,
        });

        // Optionally fetch follower details
        const followers = await User.find({ followingClubs: club._id }).select(
          "name email profileImage"
        );

        return {
          ...club.toObject(), // Convert club document to a plain object
          followersCount, // Add the followers count to each club
          followers, // Add followers details if needed
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Clubs retrieved successfully.",
      developerMessage: "",
      result: clubsWithFollowers,
      page,
      totalClubs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve clubs.",
      developerMessage: error.message,
      result: [],
    });
  }
};

// view single club

export const viewSingleClub = async (req, res) => {
  const { id } = req.params; // Get club ID from URL params
  try {
    // Find the club by ID
    const club = await Club.findById(id);

    if (club) {
      // Find followers of the club by querying the User model
      const followers = await User.find({ followingClubs: id }).select(
        "name email profileImage"
      );

      // Get the number of followers
      const followersCount = followers.length;

      return res.status(200).json({
        success: true,
        message: "Club retrieved successfully.",
        developerMessage: "",
        result: {
          ...club.toObject(), // Convert the club to a plain object
          followersCount, // Add the followers count
          followers, // Add followers details (name, email, profileImage)
        },
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Club not found.",
        developerMessage: "",
        result: [],
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve club.",
      developerMessage: error.message,
      result: [],
    });
  }
};
// Search clubs by name or description with pagination

export const searchClubs = async (req, res) => {
  const { query } = req.query; // Get the search query from query parameters
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10; // Default to 10 results per page if not provided

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query not provided.",
      developerMessage: "",
      result: [],
    });
  }

  try {
    // Perform a case-insensitive search on the club name and description
    const searchResults = await Club.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive search on name
        { description: { $regex: query, $options: "i" } }, // Case-insensitive search on description
      ],
    })
      .skip((page - 1) * limit) // Skip results for pagination
      .limit(limit); // Limit the number of results per page

    const totalResults = await Club.countDocuments({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    if (searchResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No clubs found matching the search query.",
        developerMessage: "",
        result: [],
      });
    }

    // Fetch followers count and details for each club in search results
    const clubsWithFollowers = await Promise.all(
      searchResults.map(async (club) => {
        const followersCount = await User.countDocuments({
          followingClubs: club._id,
        });

        // Optionally fetch follower details
        const followers = await User.find({ followingClubs: club._id }).select(
          "name email profileImage"
        );

        return {
          ...club.toObject(), // Convert club document to a plain object
          followersCount, // Add the followers count to each club
          followers, // Add followers details if needed
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Search results retrieved successfully.",
      developerMessage: "",
      result: clubsWithFollowers, // Return clubs with followers information
      page,
      totalClubs: totalResults,
      totalPages: Math.ceil(totalResults / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search clubs.",
      developerMessage: error.message,
      result: [],
    });
  }
};
