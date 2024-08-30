const express = require('express');
const auth   = require('../middleware/authMiddleware');
const router = express.Router();

const {
    createPost,
    updatePost,
    deletePost,
    getPostById,
    getAllPosts,
    updateLikes
} = require('../controllers/postController');

router.post('/', auth , createPost);

router.put('/:id', auth , updatePost);

router.delete('/:id', auth , deletePost);

router.get('/:id', getPostById);

router.get('/', getAllPosts);

router.post('/updateLikes' , auth , updateLikes);

module.exports = router;
