const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/signup', register);
router.post('/signin', login);
router.get('/current-user' , auth , getCurrentUser);

module.exports = router;
