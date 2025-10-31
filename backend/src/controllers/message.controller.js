const messageModel = require('../models/message.model');
const chatModel = require('../models/chat.model');
const { generateResponse } = require('../services/ai.service')

// 🆕 CREATE MESSAGE
async function createMessage(req, res) {
  console.log("📥 createMessage hit, req.user:", req.user);

  const { chatId } = req.params;
  const { content } = req.body;
  const user = req.user;

  console.log("💬 Chat ID:", chatId);
  console.log("📝 Content:", content);

  try {
    console.log("🔍 Finding chat...");
    const chat = await chatModel.findById(chatId);

    if (!chat) {
      console.log("❌ Chat not found!");
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.user.toString() !== user._id.toString()) {
      console.log("🚫 Access denied! Chat belongs to:", chat.user);
      return res.status(403).json({ message: "Access denied" });
    }

    console.log("🧩 Creating message...");
    const message = await messageModel.create({
      chat: chatId,
      user: user._id,
      content,
      role: "user",
    });

    console.log("✅ Message saved:", message);

    // 🤖 Generate Gemini AI reply
    console.log("⚡ Generating AI reply...");
    const aiText = await generateResponse(content);
    console.log("🤖 Gemini reply:", aiText);

    //  Save AI reply
    const aiMessage = await messageModel.create({
      chat: chatId,
      user: user._id,
      content: aiText,
      role: "model",
    });

    console.log("✅ AI message saved:", aiMessage._id);

    chat.lastActivity = new Date();
    await chat.save();

    //  FIXED RESPONSE — matches what frontend expects
    res.status(201).json({
      content: aiMessage.content,  //  this line is key
      message: aiMessage,
    });
  } catch (err) {
    console.error("💥 Error inside createMessage:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

//  GET CHAT MESSAGES
async function getMessages(req, res) {
  const { chatId } = req.params;

  try {
    const messages = await messageModel
      .find({ chat: chatId })
      .populate('sender', 'firstname lastname email')
      .sort({ createdAt: 1 }); // oldest first

    res.status(200).json({
      message: 'Messages fetched successfully',
      data: messages,
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createMessage,
  getMessages, //  this was missing
};
