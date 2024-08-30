const User = require('../models/User');

// Function to follow a user
const followUser = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Add receiverId to sender's following list
    const senderUpdate = User.findByIdAndUpdate(
      senderId,
      { $addToSet: { following: receiverId } }, // $addToSet ensures no duplicates
      { new: true }
    );

    // Add senderId to receiver's followers list
    const receiverUpdate = User.findByIdAndUpdate(
      receiverId,
      { $addToSet: { followers: senderId } },
      { new: true }
    );

    // Execute both updates in parallel
    const [sender, receiver] = await Promise.all([senderUpdate, receiverUpdate]);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User followed successfully', sender, receiver });
  } catch (error) {
    res.status(500).json({ message: 'Error following user', error });
  }
};

// Function to unfollow a user
const unfollowUser = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Remove receiverId from sender's following list
    const senderUpdate = User.findByIdAndUpdate(
      senderId,
      { $pull: { following: receiverId } }, // $pull removes the specified item
      { new: true }
    );

    // Remove senderId from receiver's followers list
    const receiverUpdate = User.findByIdAndUpdate(
      receiverId,
      { $pull: { followers: senderId } },
      { new: true }
    );

    // Execute both updates in parallel
    const [sender, receiver] = await Promise.all([senderUpdate, receiverUpdate]);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User unfollowed successfully', sender, receiver });
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing user', error });
  }
};

module.exports = {
  followUser,
  unfollowUser
};