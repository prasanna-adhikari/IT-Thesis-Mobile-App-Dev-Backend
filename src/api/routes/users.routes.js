import express from "express";
import {
  changePassword,
  loginAdmin,
  loginUser,
  registerUser,
  updateProfile,
  updateUserProfileImage,
  viewProfile,
  viewUsers,
} from "../controllers/user.controller.js";
import { validateRegisterBody } from "../middleware/user.middleware.js";
import { isAdmin, authenticateToken } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const userRouter = express.Router();

// Use Multer to handle file upload (single file)
userRouter.post(
  "/user/register",
  upload.single("profileImage"),
  validateRegisterBody,
  registerUser
);
userRouter.post("/user/login", validateRegisterBody, loginUser);
userRouter.post("/admin/login", validateRegisterBody, loginAdmin);
userRouter.get("/user/view", authenticateToken, isAdmin, viewUsers);
userRouter.post("/user/change-password", authenticateToken, changePassword);

userRouter.get("/user/view-profile", authenticateToken, viewProfile);
userRouter.put(
  "/user/profile/image",
  authenticateToken,
  upload.single("profileImage"),
  updateUserProfileImage
);
// userRouter.put("/user/update-profile", authenticateToken, updateProfile); // Update profile

export default userRouter;
