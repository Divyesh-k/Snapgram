// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { getMessages , sendMessage} = require('../controllers/chatController');

router.get('/:userId/:otherUserId', getMessages);
router.post('/send', sendMessage);

module.exports = router;