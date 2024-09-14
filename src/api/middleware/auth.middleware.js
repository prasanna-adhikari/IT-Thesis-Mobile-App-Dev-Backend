import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

// Middleware to authenticate the JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"]?.split(" ")[1];
    if (!authorization) {
      throw new Error("No token found.");
    } else {
      const decodedJwt = jwt.verify(
        authorization,
        process.env.ACCESS_TOKEN_SECRET || "your_default_secret"
      );
      if (decodedJwt) {
        const user = await User.findOne({
          _id: decodedJwt.id,
        });
        if (user) {
          req.currentUser = user;
          next();
        } else {
          throw new Error("Invalid token.");
        }
      } else {
        throw new Error("Token did not match.");
      }
    }
  } catch (err) {
    res.status(500).json({
      status: "Failure",
      message: "Authentication failed.",
      systemMessage: err.message,
    });
  }
};

// export const isAdmin = async (req, res, next) => {
//   try {
//     const user = req.currentUser;

//     if (user.role === "admin") {
//       next();
//     } else {
//       throw new Error("Access not granted");
//     }
//   } catch (err) {
//     res.status(500).json({
//       status: "Failure",
//       message: "Access not granted",
//       systemMessage: err.message,
//     });
//   }
// };
// Middleware to check if the user has the "club_admin" role or higher
export const isClubAdmin = async (req, res, next) => {
  try {
    const user = req.currentUser;
    // Check if the user's role is "club_admin" or higher (including "superuser")
    if (
      user.role === "club_admin" ||
      user.role === "admin" ||
      user.role === "superuser"
    ) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied. Requires Club Admin or Superuser role.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during role verification.",
      systemMessage: err.message,
    });
  }
};
// Middleware to check if the user has the "admin" role or higher
export const isAdmin = async (req, res, next) => {
  try {
    const user = req.currentUser;

    // Check if the user's role is "admin" or higher (including "superuser")
    if (user.role === "admin" || user.role === "superuser") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied. Requires Admin or Superuser role.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during role verification.",
      systemMessage: err.message,
    });
  }
};

// Middleware to check if the user has the "superuser" role
export const isSuperuser = async (req, res, next) => {
  try {
    const user = req.currentUser;

    // Check if the user's role is "superuser"
    if (user.role === "superuser") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied. Requires Superuser role.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during role verification.",
      systemMessage: err.message,
    });
  }
};
