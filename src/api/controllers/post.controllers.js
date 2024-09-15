import Post from "../models/post.model.js";
import Club from "../models/clubs.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPost = async (req, res) => {
  const { clubId } = req.params;
  const { content } = req.body;
  const userId = req.currentUser._id;

  try {
    // Find the club to ensure it exists
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found.",
      });
    }

    // Check if the user is an admin of the club
    if (!club.admin_id.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Only admins can create posts for this club.",
      });
    }

    // Prepare the media file paths (if any were uploaded)
    const media = req.files ? req.files.map((file) => file.path) : [];

    // Create a new post
    const newPost = new Post({
      clubId: club._id,
      content,
      media, // Save the media file paths in the post
      likes: [],
      shares: [],
      comments: [],
    });

    // Save the new post
    const savedPost = await newPost.save();

    // Add the post to the club's posts array
    club.posts.push(savedPost._id);
    await club.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully.",
      post: savedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the post.",
      systemMessage: error.message,
    });
  }
};

export const getSinglePost = async (req, res) => {
  const { postId } = req.params;

  try {
    // Find the post by ID
    const post = await Post.findById(postId)
      .populate("clubId")
      .populate("likes")
      .populate("shares")
      .populate("comments.userId");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully.",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the post.",
      systemMessage: error.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  const { clubId } = req.params;
  const page = parseInt(req.query.page) || 1; // Page number for pagination
  const limit = parseInt(req.query.limit) || 10; // Limit for pagination

  try {
    // Find all posts associated with the club, with pagination
    const posts = await Post.find({ clubId })
      .populate("clubId")
      .populate("likes")
      .populate("shares")
      .populate("comments.userId")
      .skip((page - 1) * limit)
      .limit(limit);

    // Count total number of posts for the club (for pagination purposes)
    const totalPosts = await Post.countDocuments({ clubId });

    return res.status(200).json({
      success: true,
      message: "Posts retrieved successfully.",
      total: totalPosts,
      page,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the posts.",
      systemMessage: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.currentUser._id;

  try {
    // Find the post to ensure it exists
    const post = await Post.findById(postId).populate("clubId");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Check if the user is an admin of the club associated with the post
    const club = post.clubId;
    if (!club.admin_id.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete posts for this club.",
      });
    }

    // Remove the post from the club's posts array
    club.posts = club.posts.filter((id) => id.toString() !== postId.toString());
    await club.save();

    // Delete the post
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the post.",
      systemMessage: error.message,
    });
  }
};

export const createEventPost = async (req, res) => {
  const { clubId } = req.params;
  const { content, eventName, eventDate, location } = req.body;
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

    // Check if the user is an admin of the club
    if (!club.admin_id.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Only club admins can create events.",
      });
    }

    // Prepare the media file paths (if any were uploaded)
    const media = req.files ? req.files.map((file) => file.path) : [];

    // Create the event post
    const newPost = new Post({
      clubId: club._id,
      content, // Event description
      isEvent: true, // Mark as event
      eventDetails: {
        eventName,
        eventDate,
        location,
        interested: [],
        going: [],
      },
      media, // Store media file paths
      likes: [],
      shares: [],
      comments: [],
    });

    // Save the event post
    const savedPost = await newPost.save();

    // Add the event post to the club's posts
    club.posts.push(savedPost._id);
    await club.save();

    return res.status(201).json({
      success: true,
      message: "Event created successfully.",
      post: savedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the event.",
      systemMessage: error.message,
    });
  }
};

// Mark as interested
export const markInterestInEvent = async (req, res) => {
  const { postId } = req.params;
  const userId = req.currentUser._id;

  try {
    const post = await Post.findById(postId);
    if (!post || !post.isEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    if (!post.eventDetails.interested.includes(userId)) {
      post.eventDetails.interested.push(userId);
      await post.save();
    }

    return res.status(200).json({
      success: true,
      message: "Marked as interested.",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while marking interest.",
      systemMessage: error.message,
    });
  }
};

// Mark as going
export const markGoingToEvent = async (req, res) => {
  const { postId } = req.params;
  const userId = req.currentUser._id;

  try {
    const post = await Post.findById(postId);
    if (!post || !post.isEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    if (!post.eventDetails.going.includes(userId)) {
      post.eventDetails.going.push(userId);
      await post.save();
    }

    return res.status(200).json({
      success: true,
      message: "Marked as going.",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while marking attendance.",
      systemMessage: error.message,
    });
  }
};

// update post
export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.currentUser._id;

  try {
    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Check if the user is authorized to update the post (admin or original creator)
    const club = await Club.findById(post.clubId);
    if (!club.admin_id.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this post.",
      });
    }

    // Update the content if provided
    if (content) {
      post.content = content;
    }

    // Handle media upload (replace or add new media files)
    const media = req.files ? req.files.map((file) => file.path) : [];
    if (media.length > 0) {
      post.media = media; // Replace existing media with the new ones
    }

    // Save the updated post
    const updatedPost = await post.save();

    return res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the post.",
      systemMessage: error.message,
    });
  }
};

// update event post
export const updateEventPost = async (req, res) => {
  const { postId } = req.params;
  const { content, eventName, eventDate, location } = req.body;
  const userId = req.currentUser._id;

  try {
    // Find the event post by ID
    const post = await Post.findById(postId);
    if (!post || !post.isEvent) {
      return res.status(404).json({
        success: false,
        message: "Event post not found.",
      });
    }

    // Check if the user is authorized to update the event post (admin or original creator)
    const club = await Club.findById(post.clubId);
    if (!club.admin_id.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this event post.",
      });
    }

    // Update the content if provided
    if (content) {
      post.content = content;
    }

    // Update event details if provided
    if (eventName || eventDate || location) {
      post.eventDetails = {
        eventName: eventName || post.eventDetails.eventName,
        eventDate: eventDate || post.eventDetails.eventDate,
        location: location || post.eventDetails.location,
      };
    }

    // Handle media upload (replace or add new media files)
    const media = req.files ? req.files.map((file) => file.path) : [];
    if (media.length > 0) {
      post.media = media; // Replace existing media with the new ones
    }

    // Save the updated event post
    const updatedEventPost = await post.save();

    return res.status(200).json({
      success: true,
      message: "Event post updated successfully.",
      post: updatedEventPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the event post.",
      systemMessage: error.message,
    });
  }
};

export const deleteEventPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.currentUser._id;

  try {
    // Find the event post by ID
    const post = await Post.findById(postId);
    if (!post || !post.isEvent) {
      return res.status(404).json({
        success: false,
        message: "Event post not found.",
      });
    }

    // Check if the user is authorized to delete the event post (admin or original creator)
    const club = await Club.findById(post.clubId);
    if (!club.admin_id.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this event post.",
      });
    }

    // Remove the media files associated with the post (optional)
    if (post.media && post.media.length > 0) {
      post.media.forEach((filePath) => {
        const fullPath = path.join(__dirname, "..", "..", filePath);
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error(`Failed to delete media file: ${filePath}`, err);
          }
        });
      });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    // Remove the post from the club's posts array
    club.posts = club.posts.filter((post) => post.toString() !== postId);
    await club.save();

    return res.status(200).json({
      success: true,
      message: "Event post deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the event post.",
      systemMessage: error.message,
    });
  }
};

// add comment
export const addComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.currentUser._id;

  try {
    // Find the post to ensure it exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Validate the comment content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment content cannot be empty.",
      });
    }

    // Handle media upload (if any)
    const media = req.files ? req.files.map((file) => file.path) : [];

    // Add the new comment
    const newComment = {
      userId: userId,
      content: content.trim(),
      media, // Save the media file paths in the comment
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    const updatedPost = await post.save();

    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the comment.",
      systemMessage: error.message,
    });
  }
};

// edit comment
export const editComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const userId = req.currentUser._id;

  try {
    // Find the post to ensure it exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Find the comment within the post
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    // Check if the current user is the owner of the comment
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this comment.",
      });
    }

    // Validate the new content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment content cannot be empty.",
      });
    }

    // Handle media upload (if any)
    const media = req.files ? req.files.map((file) => file.path) : [];

    // Update the comment content and media
    comment.content = content.trim();
    if (media.length > 0) {
      comment.media = media; // Replace existing media with the new ones
    }
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully.",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while editing the comment.",
      systemMessage: error.message,
    });
  }
};

// add reply to comment
export const addReplyToComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const userId = req.currentUser._id;

  try {
    // Find the post to ensure it exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Find the comment within the post
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    // Validate the reply content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Reply content cannot be empty.",
      });
    }

    // Handle media upload (if any)
    const media = req.files ? req.files.map((file) => file.path) : [];

    // Add the reply to the comment's replies array
    const newReply = {
      userId: userId,
      content: content.trim(),
      media, // Save the media file paths in the reply
      createdAt: new Date(),
    };

    comment.replies.push(newReply);
    await post.save();

    return res.status(201).json({
      success: true,
      message: "Reply added successfully.",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the reply.",
      systemMessage: error.message,
    });
  }
};

// delete comment
export const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.currentUser._id;

  try {
    // Find the post to ensure it exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Find the comment within the post
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    // Check if the current user is the owner of the comment
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment.",
      });
    }

    // Remove associated media files (if any)
    if (comment.media && comment.media.length > 0) {
      comment.media.forEach((filePath) => {
        const fullPath = path.join(__dirname, "..", "..", filePath);
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error(`Failed to delete media file: ${filePath}`, err);
          }
        });
      });
    }

    // Remove the comment from the post's comments array
    comment.remove();
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the comment.",
      systemMessage: error.message,
    });
  }
};

// delete comment reply
export const deleteReply = async (req, res) => {
  const { postId, commentId, replyId } = req.params;
  const userId = req.currentUser._id;

  try {
    // Find the post to ensure it exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Find the comment within the post
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    // Find the reply within the comment
    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found.",
      });
    }

    // Check if the current user is the owner of the reply
    if (reply.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this reply.",
      });
    }

    // Remove associated media files (if any)
    if (reply.media && reply.media.length > 0) {
      reply.media.forEach((filePath) => {
        const fullPath = path.join(__dirname, "..", "..", filePath);
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error(`Failed to delete media file: ${filePath}`, err);
          }
        });
      });
    }

    // Remove the reply from the comment's replies array
    reply.remove();
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Reply deleted successfully.",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the reply.",
      systemMessage: error.message,
    });
  }
};

// update reply
export const updateReply = async (req, res) => {
  const { postId, commentId, replyId } = req.params;
  const { content } = req.body;
  const userId = req.currentUser._id;

  try {
    // Find the post to ensure it exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    // Find the comment within the post
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    // Find the reply within the comment
    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found.",
      });
    }

    // Check if the current user is the owner of the reply
    if (reply.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this reply.",
      });
    }

    // Validate the new content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Reply content cannot be empty.",
      });
    }

    // Handle media upload (if any)
    const media = req.files ? req.files.map((file) => file.path) : [];

    // Update reply content and media
    reply.content = content.trim();
    if (media.length > 0) {
      // If new media is uploaded, delete the old media
      if (reply.media && reply.media.length > 0) {
        reply.media.forEach((filePath) => {
          const fullPath = path.join(__dirname, "..", "..", filePath);
          fs.unlink(fullPath, (err) => {
            if (err) {
              console.error(
                `Failed to delete old media file: ${filePath}`,
                err
              );
            }
          });
        });
      }
      reply.media = media; // Replace with new media
    }

    // Save the updated post
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Reply updated successfully.",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the reply.",
      systemMessage: error.message,
    });
  }
};
