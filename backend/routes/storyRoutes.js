// routes/storyRoutes.js
const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// Save a new story
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { mediaUrl, mediaType } = req.body;
    const story = await storyController.saveStory(req.user, mediaUrl, mediaType);
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: 'Error saving story', error: error.message });
  }
});

// Delete a story
router.delete('/:storyId', authMiddleware, async (req, res) => {
  try {
    const deletedStory = await storyController.deleteStory(req.params.storyId, req.user);
    res.json(deletedStory);
  } catch (error) {
    res.status(404).json({ message: 'Error deleting story', error: error.message });
  }
});

// Get user's stories
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const stories = await storyController.getUserStories(req.user);
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories', error: error.message });
  }
});

// Get all active stories
router.get('/all', async (req, res) => {
  try {
    const stories = await storyController.getAllActiveStories();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories', error: error.message });
  }
});

module.exports = router;