import { io } from "socket.io-client";

let socket = null;

export const initSocket = (token) => {
   console.log("🔑 Sending token to socket:", token); // <-- ADD THIS LINE
  if (socket) socket.disconnect(); // disconnect old socket if any

  socket = io("https://geego-bot.onrender.com/", {
    withCredentials: true,
   auth: { token }, // ✅ send token to backend
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
  });

  return socket;
};

export const getSocket = () => socket;
