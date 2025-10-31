require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectToDB = require('./src/db/db');
const initSocketServer = require('./src/sockets/socket.server');

// Create HTTP server for both Express and Socket.IO
const httpServer = http.createServer(app);

(async () => {
  try {
    // 🗄️ Connect to MongoDB
    await connectToDB();

    // ⚡ Initialize Socket.IO
    initSocketServer(httpServer);

    // 🚀 Start server
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Server startup failed:', err.message);
    process.exit(1);
  }
})();
