
const { Server } = require("socket.io");
const cookie = require('cookie')
const userModel = require('../models/user.model')
const jwt = require("jsonwebtoken");
const aiService = require('../services/ai.service')
const messageModel = require('../models/message.model')
const { createMemory, queryMemory } = require('../services/vector.service');
const { text } = require("express");


function initSocketServer(httpServer) {

  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });


  io.use(async (socket, next) => {
    try {
      // 1️⃣ Parse cookies (in case of browser auto auth)
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

      // 2️⃣ Check for token from either cookies OR handshake.auth
      let token = socket.handshake.auth?.token;
      if (typeof token === "object" && token?.token) token = token.token;
      if (typeof token === "string" && token.startsWith("{")) {
        try {
          token = JSON.parse(token).token;
        } catch (e) { }
      }
      console.log("🪪 Clean token:", token);

      if (!token) {
        console.error("❌ Authentication error: No token provided");
        return next(new Error("authentication error:no token provided"));
      }

      console.log("🪪 Token from socket:", socket.handshake.auth.token);

      // 3️⃣ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4️⃣ Fetch user
      const user = await userModel.findById(decoded.id);
      if (!user) throw new Error("User not found");

      // 5️⃣ Attach user to socket
      socket.user = user;
      next();
    } catch (err) {
      console.error("❌ Socket auth failed:", err.message);
      next(new Error("authentication error: invalid token"));
    }
  });

  io.on("connection", (socket) => {

    console.log('⚡ New socket connection:', socket.id);

    if (socket.user) {
      console.log('👤 User connected:', socket.user.email || socket.user._id);
    } else {
      console.log('⚠️ No user attached to socket');
    }


    socket.on('ai-message', async (messagePayload) => {

      console.log("📨 Received AI message:", messagePayload);

      const [message, vectors] = await Promise.all([
        messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: messagePayload.content,
          role: 'user'
        }),
        aiService.generateVector(messagePayload.content)
      ]);

      // 2️⃣ Once both are ready, now safely create memory
      await createMemory({
        vectors,
        messageId: message._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: messagePayload.content
        }
      });//promise all = this will do get message in DB and change to vector at the same time
      const [memory, chatHistory] = await Promise.all([
        // 1️⃣ Get similar messages from Pinecone (vector memory)
        queryMemory({
          queryVector: vectors,
          limit: 2, // top 2 closest matches
          metadata: { user: socket.user._id }
        }),

        // 2️⃣ Get recent chat messages from MongoDB
        messageModel.find({ chat: messagePayload.chat })
          .sort({ createdAt: -1 }) // latest first
          .limit(20) // only last 20 messages
          .lean() // plain JS objects, not Mongoose docs
          .then(messages => messages.reverse()) // optional: oldest first for display
      ]);
      const stm = chatHistory.map(item => {
        return {
          role: item.role,
          parts: [{ text: item.content }]
        }
      })//short term memory

      const ltm = [{
        role: 'user',
        parts: [{
          text: `
                    these are some previous msgs from the chat , use them to generate a response
                    
                    ${memory.map(item => item.metadata.text).join("\n")}

                    `}]
      }]//long term



      const response = await aiService.generateResponse([...ltm, ...stm])// created short term memory = save the memory of a section not other time other section it will forget this section 


      socket.emit('ai-response', {
        content: response,
        chat: messagePayload.chat
      })



      // New improved version — does both together= save ai response in db , generate vector for ai response
      const [responseMessage, responseVectors] = await Promise.all([
        messageModel.create({
          chat: messagePayload.chat,  // 🗨️ Which chat this message belongs to
          user: socket.user._id,      // 👤 The AI (model) is responding to the user
          content: response,          // 💬 The text AI generated
          role: 'model'               // 🧠 Indicates message came from AI
        }),
        aiService.generateVector(response) // 🔢 Generate embedding for memory storage
      ])

      await createMemory({
        vectors: responseVectors,
        messageId: responseMessage._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response
        }

      })
    })
  });


}
module.exports = initSocketServer

// user messsage save in db => generate vector for user msg => query in pincone for related memories => save user msg in pinecone=> chat history retrive(get the chat history from the db) => generate response from the ai=> save ai response in db => generate vector for ai resoponse => save ai msg in pincone  => send ai response to user 