import User from "../models/users.model.js";
import Club from "../models/clubs.model.js";
import Post from "../models/post.model.js";

export const search = async (req, res) => {
  const { query, filter } = req.query; // Get the search term and filter from the query string
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!query || query.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Search query cannot be empty.",
    });
  }

  try {
    const searchTerm = query.trim();
    let results = {};

    // Determine which filter to apply, if any
    if (!filter || filter === "all") {
      // Search across all categories (users, clubs, and posts)
      const userResults = await User.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .limit(limit)
        .skip((page - 1) * limit);

      const clubResults = await Club.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .limit(limit)
        .skip((page - 1) * limit);

      const postResults = await Post.find({
        content: { $regex: searchTerm, $options: "i" },
      })
        .populate("clubId")
        .limit(limit)
        .skip((page - 1) * limit);

      results = {
        users: userResults,
        clubs: clubResults,
        posts: postResults,
      };
    } else if (filter === "user") {
      // Search only in Users
      const userResults = await User.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .limit(limit)
        .skip((page - 1) * limit);

      results = { users: userResults };
    } else if (filter === "club") {
      // Search only in Clubs
      const clubResults = await Club.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .limit(limit)
        .skip((page - 1) * limit);

      results = { clubs: clubResults };
    } else if (filter === "post") {
      // Search only in Posts
      const postResults = await Post.find({
        content: { $regex: searchTerm, $options: "i" },
      })
        .populate("clubId")
        .limit(limit)
        .skip((page - 1) * limit);

      results = { posts: postResults };
    }

    return res.status(200).json({
      success: true,
      message: "Search results retrieved successfully.",
      results,
      page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during the search.",
      systemMessage: error.message,
    });
  }
};
