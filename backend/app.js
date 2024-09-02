const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const initializeSocket = require("./socket"); // Import socket.js

// Load environment variables from .env file
dotenv.config();

// Initialize HTTP server and Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// Initialize Socket.IO with the server
initializeSocket(io);

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI; // Use environment variable

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use CORS to allow requests from your frontend
app.use(cors())

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, "public")));

// frontend dist file
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(express.static(path.join(path.resolve(), "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(path.resolve(), "frontend", "dist", "index.html"));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
