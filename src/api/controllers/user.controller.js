const User = require("../models/User.model");
const { encryptPassword } = require("../utilities/auth.utilities");

export const registerUser = async (req, res, next) => {
  try {
    const { studentId, name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
        developerMessage: "",
        result: {},
      });
    } else {
      const { error, hash } = await encryptPassword(password);
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Could not register user.",
          developerMessage: "",
          result: {},
        });
      } else {
        const userObj = new User({
          studentId,
          name,
          email,
          password: hash,
          role,
          verified: false, // User is registered but not verified
        });

        const user = await userObj.save();

        // Respond with success message
        return res.status(201).json({
          success: true,
          message: "User registered successfully.",
          developerMessage: "",
          result: {
            user: user, // Return the registered user object if needed
          },
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not register user.",
      developerMessage: error.message,
      result: {},
    });
  }
};
