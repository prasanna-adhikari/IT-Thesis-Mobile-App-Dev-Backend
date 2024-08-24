import express from "express";
import { registerUser } from "../controllers/user.controller.js";
import { validateRegisterBody } from "../middleware/user.middleware.js";

const userRouter = express.Router();
// console.log("I am here");

userRouter.post("/user/register", validateRegisterBody, registerUser);

export default userRouter;
