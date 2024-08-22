require("dotenv").config(); // Load environment variables
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

// Middleware to authenticate the JWT token
const authenticateToken = async (req, res, next) => {
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
          isArchived: false,
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

module.exports = {
  authenticateToken,
};
