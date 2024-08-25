import User from "../models/users.model.js";
import {
  decryptPassword,
  encryptPassword,
  generateToken,
} from "../utilities/auth.utilities.js";
import bcrypt from "bcrypt";

// register User
export const registerUser = async (req, res, next) => {
  try {
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

// login user
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({
      email: email,
    });

    if (userFound) {
      if (userFound.verified) {
        const plainPassword = password;
        const hashedPassword = userFound.password;
        const passwordMatched = await decryptPassword(
          plainPassword,
          hashedPassword
        );

        if (passwordMatched) {
          const token = generateToken(userFound._id);
          if (token) {
            return res.status(200).json({
              success: true,
              message: "Login successful",
              developerMessage: "",
              result: userFound,
              token: token,
              permissionLevel: userFound.permissionLevel,
            });
          } else {
            res.status(500).json({
              success: false,
              message: "Token generation failed",
              developerMessage: "",
              result: {},
            });
          }
        } else {
          res.status(400).json({
            success: false,
            message: "Either email or password is incorrect",
            developerMessage: "",
            result: {},
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "User is not verified",
          developerMessage: "",
          result: {},
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: "User not found",
        developerMessage: "",
        result: {},
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
      developerMessage: error.message,
      result: {},
    });
  }
};

// admin login
export const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({
      email: email,
      permissionLevel: "admin",
      isArchived: false,
    });

    if (userFound) {
      const plainPassword = password;
      const hashedPassword = userFound.password;
      const passwordMatched = await decryptPassword(
        plainPassword,
        hashedPassword
      );

      if (passwordMatched) {
        const token = generateToken(userFound._id);
        if (token) {
          const returnData = {
            _id: userFound?._id,
            studentId: userFound?.studentId,
            name: userFound?.name,
            email: userFound?.email,
            verified: userFound?.verified,
          };
          return res.status(200).json({
            success: true,
            message: "Login successful",
            developerMessage: "",
            result: returnData,
            token: token,
            role: userFound.role,
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Token generation failed",
            developerMessage: "",
            result: {},
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "Incorrect email or password",
          developerMessage: "",
          result: {},
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: "Admin not found",
        developerMessage: "",
        result: {},
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
      developerMessage: error.message,
      result: {},
    });
  }
};

export const viewUsers = async (req, res, next) => {
  const page = parseInt(req?.query.page) || 1;
  const limit = parseInt(req?.query.limit) || 0;
  const userID = req.query.userID;

  try {
    const user = trimObject({
      isArchived: false,
      _id: userID,
      role: "admin",
    });

    const userList = await User.find(user)
      .skip(page * limit - limit)
      .limit(limit);
    const totalUsers = await User.countDocuments(user);

    if (totalUsers > 0) {
      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        developerMessage: "",
        result: userList,
        page,
        total: totalUsers,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "No users found",
        developerMessage: "",
        result: [],
        page,
        total: totalUsers,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not retrieve users",
      developerMessage: error.message,
      result: [],
    });
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.currentUser; // Assuming `currentUser` is set after authentication

    // Check if the old password matches
    const passwordMatched = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatched) {
      return res.status(400).json({
        status: "Failure",
        message: "Old password is incorrect",
        systemMessage: "",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      status: "Success",
      message: "Password changed successfully",
      systemMessage: "",
    });
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "An error occurred while changing the password",
      systemMessage: error.message,
    });
  }
};

// view profile
export const viewProfile = async (req, res) => {
  try {
    // Get the user from req.currentUser
    const user = req.currentUser;

    if (!user) {
      return res.status(404).json({
        status: "Failure",
        message: "User not found.",
        systemMessage: "",
      });
    }

    // Return the user profile data
    return res.status(200).json({
      status: "Success",
      message: "User profile retrieved successfully.",
      systemMessage: "",
      result: {
        studentId: user.studentId,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "An error occurred while retrieving the user profile.",
      systemMessage: error.message,
    });
  }
};

// update user
export const updateProfile = async (req, res) => {
  try {
    // Get the user from req.currentUser
    const user = req.currentUser;

    if (!user) {
      return res.status(404).json({
        status: "Failure",
        message: "User not found.",
        systemMessage: "",
      });
    }

    // Update the user fields with the data from req.body
    const { name, email } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;

    // Save the updated user data to the database
    await user.save();

    // Return the updated user profile data
    return res.status(200).json({
      status: "Success",
      message: "User profile updated successfully.",
      systemMessage: "",
      result: {
        studentId: user.studentId,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "An error occurred while updating the user profile.",
      systemMessage: error.message,
    });
  }
};
