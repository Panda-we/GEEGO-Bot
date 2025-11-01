const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path=require('path')


const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const messageRoutes = require('./routes/message.routes');

const app = express();

// 🧩 Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.static(path.join(__dirname,'../public')))

// 🛣️ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes); // ✅ separate path to avoid overlap


app.get('*name',(req,res)=>{
  res.sendFile(path.join(__dirname,'../public/index.html'))
})

module.exports = app;
