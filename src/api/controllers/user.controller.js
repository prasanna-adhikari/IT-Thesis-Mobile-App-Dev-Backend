import User from "../models/users.model.js";
import { encryptPassword } from "../utilities/auth.utilities.js";

export const registerUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const { studentId, name, email, password, role } = req.body;

    // Check if user exists by email
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.status(400).json({
        success: false,
        message: "Email address already exists.",
        developerMessage:
          "The email address provided is already associated with another account.",
        result: {},
      });
    }

    // Check if user exists by studentId
    const existingStudentIdUser = await User.findOne({ studentId });
    if (existingStudentIdUser) {
      return res.status(400).json({
        success: false,
        message: "Student ID already exists.",
        developerMessage:
          "The student ID provided is already associated with another account.",
        result: {},
      });
    }

    // Encrypt password
    const { error, hash } = await encryptPassword(password);
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Could not register user.",
        developerMessage: "Error encrypting password.",
        result: {},
      });
    }

    // Create new user
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
