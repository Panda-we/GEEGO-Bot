const express=require('express')
const authMiddleware=require('../middlewares/auth.middleware')
const chatController=require('../controllers/chat.controller')

const router =express.Router()


/**
 * @route   POST /api/chat
 * @desc    Create a new chat
 * @access  Private
 */
//post=/api/chat=new chat created after login and middlware use  see app.js
router.post('/',authMiddleware.authUser, chatController.createChat)

/**
 * @route   GET /api/chat
 * @desc    Get all chats for the logged-in user
 * @access  Private
 */
router.get('/', authMiddleware.authUser, chatController.getChats);
//get all chats of user

/**
 * @route   DELETE /api/chat/:id
 * @desc    Delete a chat by ID (must belong to the logged-in user)
 * @access  Private
 */
// 🗑 delete a chat by ID
router.delete('/:id', authMiddleware.authUser, chatController.deleteChat);

/**
 * @route   POST /api/chat/generate-title
 * @desc    Generate a chat title from user and AI messages
 * @access  Private
 */
router.post('/generate-title', authMiddleware.authUser, chatController.generateChatTitle);


module.exports=router  
