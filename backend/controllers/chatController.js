
// controllers/chatController.js
const ChatMessage = require('../models/Chat');

const getMessages = async (req, res) => {
  const { userId, otherUserId } = req.params;
  try {
    const messages = await ChatMessage.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ time: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

const sendMessage = async (data) => {
  const { sender, receiver, message, time } = data;
  try {
    const newMessage = new ChatMessage({ sender, receiver, message, time });
    await newMessage.save();
    return newMessage;
  } catch (error) {
    throw new Error('Failed to send message');
  }
};

const markMessageAsRead = async (messageId) => {
  try {
    const updatedMessage = await ChatMessage.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );
    return updatedMessage;
  } catch (error) {
    throw new Error('Failed to mark message as read');
  }
};

module.exports = { getMessages, sendMessage, markMessageAsRead };