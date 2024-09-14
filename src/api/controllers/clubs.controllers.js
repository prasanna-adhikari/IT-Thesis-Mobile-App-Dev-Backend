// controllers/clubController.js

export const createClub = async (req, res) => {
  try {
    let { name, description } = req.body;
    const user = req.currentUser;

    // Check if user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({
        status: "Failure",
        message: "Access denied. Only admins can create clubs.",
        systemMessage: "",
      });
    }

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

    return res.status(200).json({
      status: "Success",
      message: "Club deleted successfully.",
      systemMessage: "",
      result: deletedClub,
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
// controllers/club.controller.js

export const viewAllClubs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // Default limit to 10

  try {
    // Fetch all clubs with pagination
    const clubs = await Club.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalClubs = await Club.countDocuments();

    return res.status(200).json({
      success: true,
      message: "Clubs retrieved successfully.",
      developerMessage: "",
      result: clubs,
      page,
      total: totalClubs,
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
      return res.status(200).json({
        success: true,
        message: "Club retrieved successfully.",
        developerMessage: "",
        result: club,
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
