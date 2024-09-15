import FriendRequest from "../models/friendRequest.model.js";
import User from "../models/users.model.js";

// Send a friend request
export const sendFriendRequest = async (req, res) => {
  const requesterId = req.currentUser._id;
  const { recipientId } = req.params;

  try {
    // Check if recipient exists and filter out the current user in a single query
    const recipient = await User.findOne({
      _id: recipientId,
      _id: { $ne: requesterId }, // Filter out the current user
    });

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "User not found or you cannot send a request to yourself.",
      });
    }

    // Check if the users are already friends
    const requester = await User.findOne({
      _id: requesterId,
      friends: recipientId, // Check if the recipient is already in the requester's friends list
    });

    if (requester) {
      return res.status(400).json({
        success: false,
        message: "You are already friends with this user.",
      });
    }

    // Check if a friend request already exists between these users
    const existingRequest = await FriendRequest.findOne({
      requester: requesterId,
      recipient: recipientId,
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Friend request already sent.",
      });
    }

    // Create and save a new friend request
    const friendRequest = new FriendRequest({
      requester: requesterId,
      recipient: recipientId,
    });

    await friendRequest.save();

    return res.status(201).json({
      success: true,
      message: "Friend request sent successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending the friend request.",
      systemMessage: error.message,
    });
  }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  const recipientId = req.currentUser._id;

  try {
    // Find the friend request, ensuring it belongs to the current user
    const friendRequest = await FriendRequest.findOne({
      _id: requestId,
      recipient: recipientId,
      status: "pending",
    });

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found or already handled.",
      });
    }

    // Update the status to "accepted"
    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add both users to each other's friend lists using MongoDB's $addToSet to avoid duplicates
    await User.updateMany(
      { _id: { $in: [friendRequest.requester, recipientId] } },
      {
        $addToSet: {
          friends: { $each: [friendRequest.requester, recipientId] },
        },
      }
    );

    // Exclude the current user from their own friends list
    await User.updateOne(
      { _id: recipientId },
      { $pull: { friends: recipientId } } // Remove the recipientId (current user) from their own friends list
    );

    await User.updateOne(
      { _id: friendRequest.requester },
      { $pull: { friends: friendRequest.requester } } // Remove the requester from their own friends list
    );

    return res.status(200).json({
      success: true,
      message: "Friend request accepted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while accepting the friend request.",
      systemMessage: error.message,
    });
  }
};

// Reject a friend request
// Reject a friend request and delete it from the FriendRequest table
export const rejectFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  const recipientId = req.currentUser._id;

  try {
    // Find the friend request, ensuring it belongs to the current user
    const friendRequest = await FriendRequest.findOne({
      _id: requestId,
      recipient: recipientId,
      status: "pending",
    });

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found or already handled.",
      });
    }

    // Delete the friend request after rejection
    await FriendRequest.deleteOne({ _id: requestId });

    return res.status(200).json({
      success: true,
      message: "Friend request rejected and deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while rejecting the friend request.",
      systemMessage: error.message,
    });
  }
};

// Remove a friend
// Remove a friend and associated friend requests
export const removeFriend = async (req, res) => {
  const currentUserId = req.currentUser._id;
  const { friendId } = req.params;

  try {
    // Check if the friend exists in the current user's friend list
    const currentUser = await User.findOne({
      _id: currentUserId,
      friends: friendId,
    });

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Friend not found in your friend list.",
      });
    }

    // Remove each user from the other's friends list
    await User.updateMany(
      { _id: { $in: [currentUserId, friendId] } },
      { $pull: { friends: { $in: [currentUserId, friendId] } } }
    );

    // Delete any friend requests between the two users (whether sent or received)
    await FriendRequest.deleteMany({
      $or: [
        { requester: currentUserId, recipient: friendId },
        { requester: friendId, recipient: currentUserId },
      ],
    });

    return res.status(200).json({
      success: true,
      message:
        "Friend removed successfully and associated friend requests deleted.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while removing the friend.",
      systemMessage: error.message,
    });
  }
};

// Get all friend requests for the current user (incoming and outgoing)
export const getFriendRequests = async (req, res) => {
  const userId = req.currentUser._id;

  try {
    // Find incoming friend requests (where the current user is the recipient)
    const incomingRequests = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("requester", "name email profileImage"); // Populate requester info (optional)

    // Find outgoing friend requests (where the current user is the requester)
    const outgoingRequests = await FriendRequest.find({
      requester: userId,
      status: "pending",
    }).populate("recipient", "name email profileImage"); // Populate recipient info (optional)

    return res.status(200).json({
      success: true,
      message: "Friend requests retrieved successfully.",
      result: {
        incomingRequests, // Friend requests sent to the current user
        outgoingRequests, // Friend requests sent by the current user
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching friend requests.",
      systemMessage: error.message,
    });
  }
};
