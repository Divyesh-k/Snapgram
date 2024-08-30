// controllers/storyController.js
const { Story } = require('../models/Story');

// Function to save a new story
exports.saveStory = async (userId, mediaUrl, mediaType) => {
  try {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    const type = mediaType.startsWith('video/') ? 'video' : 'image';
    const newStory = new Story({
      user: userId,
      mediaUrl,
      mediaType : type,
      expiresAt
    });

    const savedStory = await newStory.save();
    return savedStory;
  } catch (error) {
    console.error('Error saving story:', error);
    throw error;
  }
};

// Function to delete a story
exports.deleteStory = async (storyId, userId) => {
  try {
    const deletedStory = await Story.findOneAndDelete({ _id: storyId, user: userId });
    if (!deletedStory) {
      throw new Error('Story not found or user not authorized');
    }
    return deletedStory;
  } catch (error) {
    console.error('Error deleting story:', error);
    throw error;
  }
};

// Function to get stories for a user
exports.getUserStories = async (userId) => {
  try {
    const stories = await Story.find({ user: userId }).sort({ createdAt: -1 });
    return stories;
  } catch (error) {
    console.error('Error fetching user stories:', error);
    throw error;
  }
};

// Function to get all active stories (for all users)
exports.getAllActiveStories = async () => {
  try {
    const stories = await Story.find({ expiresAt: { $gt: new Date() } })
      .sort({ createdAt: -1 })
      .populate({
        path : 'user',
        select : 'username profilePicture'
      }); // Assuming you want user details
    return stories;
  } catch (error) {
    console.error('Error fetching all active stories:', error);
    throw error;
  }
};