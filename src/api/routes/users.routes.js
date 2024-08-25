import express from "express";
import {
  changePassword,
  loginAdmin,
  loginUser,
  registerUser,
  updateProfile,
  viewProfile,
  viewUsers,
} from "../controllers/user.controller.js";
import { validateRegisterBody } from "../middleware/user.middleware.js";
import { isAdmin, authenticateToken } from "../middleware/auth.middleware.js";

const userRouter = express.Router();
// console.log("I am here");

userRouter.post("/user/register", validateRegisterBody, registerUser);
userRouter.post("/user/login", validateRegisterBody, loginUser);
userRouter.post("/admin/login", validateRegisterBody, loginAdmin);
userRouter.get("/user/view", authenticateToken, isAdmin, viewUsers);
userRouter.post("/change-password", authenticateToken, changePassword);

userRouter.get("/user/view-profile", authenticateToken, viewProfile); // View profile
userRouter.put("/user/update-profile", authenticateToken, updateProfile); // Update profile

export default userRouter;
