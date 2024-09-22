import express from "express";
import {
  changePassword,
  deleteUserByAdmin,
  loginAdmin,
  loginUser,
  registerUser,
  searchUsers,
  updateProfile,
  updateUserByAdmin,
  updateUserProfileImage,
  viewProfile,
  viewUserDetail,
  viewUsers,
} from "../controllers/user.controller.js";
import { validateRegisterBody } from "../middleware/user.middleware.js";
import {
  isAdmin,
  authenticateToken,
  isSuperuser,
} from "../middleware/auth.middleware.js";
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
userRouter.get(
  "/user/view/:userId",
  authenticateToken,
  isAdmin,
  viewUserDetail
);
userRouter.post("/user/change-password", authenticateToken, changePassword);

userRouter.get("/user/view-profile", authenticateToken, viewProfile);
userRouter.put(
  "/user/profile/image",
  authenticateToken,
  upload.single("profileImage"),
  updateUserProfileImage
);

userRouter.put("/user/:userId", authenticateToken, isAdmin, updateUserByAdmin);
userRouter.delete(
  "/user/:userId",
  authenticateToken,
  isAdmin,
  deleteUserByAdmin
);
userRouter.get("/user/search", authenticateToken, isAdmin, searchUsers);

// userRouter.put("/user/update-profile", authenticateToken, updateProfile); // Update profile

export default userRouter;
