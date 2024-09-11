import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "../api/routes/users.routes.js";
import clubRouter from "../api/routes/clubs.route.js";
import clubFollorRouter from "../api/routes/clubsfollow.route.js";

const app = express();
dotenv.config();

app.use(cors());

// To parse JSON bodies
app.use(express.json());

// To parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// adding routes
app.use("/api", userRouter);
app.use("/api", clubRouter);
app.use("/api", clubFollorRouter);

export default app;
