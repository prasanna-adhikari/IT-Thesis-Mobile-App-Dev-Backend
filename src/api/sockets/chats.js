import Message from "../models/message.model.js";
import User from "../models/users.model.js";

// Handle chat-related socket events
export const handleSocketEvents = (socket, io) => {
  // When a user joins their personal room (based on user ID)
  socket.on("joinRoom", ({ userId }) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  // Handle the sending of messages between two users
  socket.on("sendMessage", async ({ senderId, recipientId, messageText }) => {
    try {
      // Verify if the users are friends before sending the message
      const sender = await User.findById(senderId);
      const recipient = await User.findById(recipientId);

      if (!sender || !recipient || !sender.friends.includes(recipientId)) {
        socket.emit("errorMessage", "You can only message friends.");
        return;
      }

      // Save the message in the database
      const newMessage = new Message({
        sender: senderId,
        recipient: recipientId,
        message: messageText,
      });
      await newMessage.save();

      // Emit the message to the recipient in their room
      io.to(recipientId).emit("receiveMessage", {
        senderId,
        messageText,
        createdAt: newMessage.createdAt,
      });

      // Notify the sender that the message was sent successfully
      socket.emit("messageSent", { success: true });
    } catch (error) {
      socket.emit(
        "errorMessage",
        "An error occurred while sending the message."
      );
    }
  });
};
