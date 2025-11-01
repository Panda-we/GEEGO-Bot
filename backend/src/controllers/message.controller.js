const messageModel = require("../models/message.model");
const chatModel = require("../models/chat.model");
const { generateResponse } = require("../services/ai.service");

// CREATE MESSAGE
async function createMessage(req, res) {
  const { chatId } = req.params;
  const { content } = req.body;
  const user = req.user;

  try {
    const chat = await chatModel.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    if (chat.user.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Save user message
    const message = await messageModel.create({
      chat: chatId,
      user: user._id,
      content,
      role: "user",
    });

    // Generate AI reply
    const aiText = await generateResponse(content);

    // Save AI reply (no user reference for AI)
    const aiMessage = await messageModel.create({
      chat: chatId,
      content: aiText,
      role: "model",
    });

    chat.lastActivity = new Date();
    await chat.save();

    res.status(201).json({
      content: aiMessage.content,
      message: aiMessage,
    });
  } catch (err) {
    console.error("💥 Error inside createMessage:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

// GET CHAT MESSAGES
async function getMessages(req, res) {
  const { chatId } = req.params;

  try {
    const messages = await messageModel
      .find({ chat: chatId })
      .populate("user", "firstname lastname email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createMessage,
  getMessages,
};

