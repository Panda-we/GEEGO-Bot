const express = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const messageController = require('../controllers/message.controller');
const router = express.Router();

/**
 * @route   POST /api/chat/:chatId/messages
 * @desc    Send a new message in a chat
 * @access  Private
 */
// POST /api/chat/:chatId/messages → create message
router.post('/:chatId/messages', authMiddleware.authUser, messageController.createMessage);


/**
 * @route   GET /api/chat/:chatId/messages
 * @desc    Fetch all messages in a specific chat
 * @access  Private
 */
// GET /api/chat/:chatId/messages → get messages
router.get('/:chatId/messages', authMiddleware.authUser, messageController.getMessages);

module.exports = router;
