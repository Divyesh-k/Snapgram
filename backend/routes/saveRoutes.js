// routes/saveRoutes.js

const express = require('express');
const router = express.Router();
const {savePost , deleteSavedPost} = require('../controllers/saveController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, savePost);

router.delete('/:saveId', auth, deleteSavedPost);

module.exports = router;
