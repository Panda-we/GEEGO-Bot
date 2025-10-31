const express = require('express');
const authControllers = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authControllers.registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Log in an existing user
 * @access  Public
 */
router.post('/login', authControllers.loginUser);

module.exports = router;
