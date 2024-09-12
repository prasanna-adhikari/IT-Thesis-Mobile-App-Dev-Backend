import Post from "../models/post.model.js";
import Club from "../models/clubs.model.js";

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

    // Create a new post
    const newPost = new Post({
      clubId: club._id,
      content,
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

    // Add the new comment
    const newComment = {
      userId: userId,
      content: content.trim(),
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

    // Update the comment content
    comment.content = content.trim();
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

    // Add the reply to the comment's replies array
    const newReply = {
      userId: userId,
      content: content.trim(),
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
