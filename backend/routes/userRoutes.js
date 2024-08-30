const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// GET all users
router.get('/all', UserController.getAllUsers);

// GET user by ID
router.get('/:id', UserController.getUserById);

// POST new user
router.post('/', UserController.createUser);

// PUT update user
router.put('/:id', UserController.updateUser);

// DELETE user
router.delete('/:id', UserController.deleteUser);

module.exports = router;
