import Post from "../models/post.model.js";
import User from "../models/users.model.js";

export const getNewsfeed = async (req, res) => {
  const userId = req.currentUser._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    // Fetch the user to get the list of followed clubs
    const user = await User.findById(userId).populate("followingClubs");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Get all the club IDs that the user follows
    const followedClubIds = user.followingClubs.map((club) => club._id);

    // Fetch the posts from the clubs the user follows, ordered by the most recent
    const posts = await Post.find({
      clubId: { $in: followedClubIds },
    })
      .sort({ createdAt: -1 }) // Sort by most recent posts
      .skip((page - 1) * limit) // Pagination
      .limit(limit)
      .populate("clubId")
      .populate("likes")
      .populate("shares")
      .populate("comments.userId");

    // Count total posts for pagination
    const totalPosts = await Post.countDocuments({
      clubId: { $in: followedClubIds },
    });

    return res.status(200).json({
      success: true,
      message: "Newsfeed retrieved successfully.",
      posts,
      total: totalPosts,
      page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the newsfeed.",
      systemMessage: error.message,
    });
  }
};
