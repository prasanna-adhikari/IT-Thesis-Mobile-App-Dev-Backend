import Message from "../models/message.model.js";

export const getChatHistory = async (req, res) => {
  const { friendId } = req.params;
  const userId = req.currentUser._id;

  try {
    // Find chat history between the current user and the friend
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: friendId },
        { sender: friendId, recipient: userId },
      ],
    }).sort({ createdAt: 1 }); // Sort by oldest first

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving chat history.",
      error: error.message,
    });
  }
};
