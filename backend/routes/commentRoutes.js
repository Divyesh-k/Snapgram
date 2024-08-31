const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/authMiddleware');

// POST /comments: Create a new comment
router.post('/', auth , commentController.createComment);

// GET /comments: Fetch comments for a specific post
router.get('/:post_id', commentController.getCommentsByPost);

// PUT /comments/:comment_id: Update a comment
router.post('/:comment_id', commentController.updateComment);

// DELETE /comments/:comment_id: Delete a comment
router.delete('/:comment_id', commentController.deleteComment);

module.exports = router;
