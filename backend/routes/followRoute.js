const express = require('express');
const router = express.Router();
const { followUser, getFollowers, getFollowing, unfollowUser } = require('../controllers/followController');
const authMiddleware = require('../middleware/authMiddleware'); // Adjust the path as needed

// Route to follow a user
router.post('/', authMiddleware, followUser);
router.post('/unfollow' , authMiddleware , unfollowUser);

module.exports = router;
