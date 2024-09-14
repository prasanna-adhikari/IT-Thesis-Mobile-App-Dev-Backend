// import app from "./app/app.js";
// import database from "./database/database.js";

// const PORT = process.env.PORT || 7000;
// const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mobileapp";

// app.listen(PORT, () => {
//   database(mongoURI);
//   console.info(`API Server Started at Port: ${PORT}`);
// });
import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "../src/app/app.js";
import { handleSocketEvents } from "../src/api/sockets/chats.js";
import database from "../src/database/database.js"; // Ensure this path is correct

// Create HTTP server
const server = http.createServer(app);

// Whitelist domains for CORS (adjust as needed)
const whitelist = ["http://localhost:3000", "https://mydomain.com"];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: whitelist,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Handle socket events for chat
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);
  handleSocketEvents(socket, io);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server and connect to MongoDB
const PORT = process.env.PORT || 7000;
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mobileapp"; // Ensure this is the correct URI

server.listen(PORT, async () => {
  try {
    await database(mongoURI); // Ensure MongoDB is connected
    console.info(`API Server Started at Port: ${PORT}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
});
