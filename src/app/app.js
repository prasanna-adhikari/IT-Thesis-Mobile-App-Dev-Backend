import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "../api/routes/users.routes.js";

const app = express();
dotenv.config();

app.use(cors());

// To parse JSON bodies
app.use(express.json());

// To parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// adding routes
app.use("/api/", userRouter);

export default app;
