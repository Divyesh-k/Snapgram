// routes/index.js
const express = require('express');
const router = express.Router();

// Import route handlers
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");
const uploadRoutes = require("./uploadRoutes");
const saveRoutes = require("./saveRoutes");
const followRoutes = require("./followRoute");
const storyRoutes = require("./storyRoutes");
const chatRoutes = require("./chatRoutes");

// Use route handlers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/upload', uploadRoutes);
router.use('/save', saveRoutes);
router.use('/follow', followRoutes);
router.use('/stories', storyRoutes);
router.use('/chat', chatRoutes);

module.exports = router;