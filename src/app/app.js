import express from "express";
import cors from "cors";

const app = express();
require("dotenv").config();

app.use(cors());

console.log("App page");

export default app;
