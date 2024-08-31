const Comment = require('../models/Comment');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { content, author, post_id , parent_id} = req.body;
    const newComment = new Comment({ content, author, post_id, parent_id });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// Fetch comments for a specific post
exports.getCommentsByPost = async (req, res) => {
  try {
    const post_id = req.params.post_id;
    console.log(post_id);
    const comments = await Comment.find({ post_id }).populate('author');
    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { content } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(
      comment_id,
      { content, updated_at: Date.now() },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(comment_id);
    if (!deletedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
