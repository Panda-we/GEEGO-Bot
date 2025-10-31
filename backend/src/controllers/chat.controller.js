const chatModel = require('../models/chat.model');

async function deleteChat(req, res) {
  try {
    const chat = await chatModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    res.json({ message: 'Chat deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting chat', error: err.message });
  }
};
// ✅ Create new chat
async function createChat(req, res) {
  const { title } = req.body;
  const user = req.user;

  try {
     if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Chat title is required' });
    }
    
    const chat = await chatModel.create({
      user: user._id,
      title,
      lastActivity:Date.now()
    });

    res.status(201).json({
  message: 'Chat created successfully',
  chat: {
    _id: chat._id,
    title: chat.title,
    lastActivity: chat.lastActivity,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    user: chat.user,
  },
});

  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// ✅ Get all chats for a user
async function getChats(req, res) {
  const user = req.user;

  try {
    const chats = await chatModel
      .find({ user: user._id })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: 'Chats fetched successfully',
      chats,
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createChat,
  getChats, // ✅ export this,
  deleteChat
};
