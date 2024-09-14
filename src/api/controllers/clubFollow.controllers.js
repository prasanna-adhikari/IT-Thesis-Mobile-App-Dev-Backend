import Club from "../models/clubs.model.js";
import User from "../models/users.model.js";

export const followClub = async (req, res) => {
  const { clubId } = req.params;
  const userId = req.currentUser._id;

  try {
    // Check if the club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found.",
      });
    }

    // Check if the user is already following the club
    const user = await User.findById(userId);
    if (user.followingClubs.includes(clubId)) {
      return res.status(400).json({
        success: false,
        message: "You are already following this club.",
      });
    }

    // Add the club to the user's followingClubs list
    user.followingClubs.push(clubId);
    await user.save();

    // Fetch the updated user details
    const updatedUser = await User.findById(userId).populate("followingClubs"); // populate followingClubs if needed

    return res.status(200).json({
      success: true,
      message: "Successfully followed the club.",
      user: updatedUser, // Return the updated user details
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while trying to follow the club.",
      systemMessage: error.message,
    });
  }
};

export const unfollowClub = async (req, res) => {
  const { clubId } = req.params;
  const userId = req.currentUser._id;

  try {
    // Check if the club exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found.",
      });
    }

    // Check if the user is following the club
    const user = await User.findById(userId);
    if (!user.followingClubs.includes(clubId)) {
      return res.status(400).json({
        success: false,
        message: "You are not following this club.",
      });
    }

    // Remove the club from the user's followingClubs list
    user.followingClubs = user.followingClubs.filter(
      (id) => id.toString() !== clubId.toString()
    );
    await user.save();

    // Fetch the updated user details
    const updatedUser = await User.findById(userId).populate("followingClubs"); // populate followingClubs if needed

    return res.status(200).json({
      success: true,
      message: "Successfully unfollowed the club.",
      user: updatedUser, // Return the updated user details
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while trying to unfollow the club.",
      systemMessage: error.message,
    });
  }
};

export const getFollowedClubs = async (req, res) => {
  try {
    const user = req.currentUser;
    // Fetching clubs that the user follows
    const followedClubs = await Club.find({
      _id: { $in: user.followingClubs },
    });

    if (followedClubs.length > 0) {
      return res.status(200).json({
        status: "Success",
        message: "Followed clubs retrieved successfully.",
        result: followedClubs,
      });
    } else {
      return res.status(200).json({
        status: "Success",
        message: "No followed clubs found.",
        result: [],
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "Failure",
      message: "Could not retrieve followed clubs.",
      systemMessage: error.message,
    });
  }
};
