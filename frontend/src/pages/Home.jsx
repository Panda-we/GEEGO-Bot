import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sidebar } from '../components/Sidebar';
import { ChatMessage } from '../components/ChatMessage';
import { NewChatModal } from '../components/NewChatModal';
import {
  selectChats,
  selectCurrentChat,
  selectMessages,
  selectIsLoading,
  addChat,
  setChats,
  setCurrentChat,
  addMessage,
  setLoading,
  clearCurrentChat,
  updateChatTitle
} from '../store/slices/chatSlice';
import instance from '../utils/axios';
import '../styles/chat.css';
import { initSocket, getSocket } from "../utils/socket";
import "../styles/Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const chats = useSelector(selectChats);
  const currentChat = useSelector(selectCurrentChat);
  const messages = useSelector(selectMessages);
  const isLoading = useSelector(selectIsLoading);

  const [inputMessage, setInputMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showInstruction, setShowInstruction] = useState(false);
const [pageLoading, setPageLoading] = useState(false);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // ✅ Fix: show popup every refresh (once per page load)
  useEffect(() => {
    setShowInstruction(true);
  }, []);

  // ✅ Load chats on mount
  useEffect(() => {
    const loadChats = async () => {
      try {
        const res = await instance.get('/chat');
        dispatch(setChats(res.data.chats));
      } catch (err) {
        console.error('Error loading chats:', err);
      }
    };
    loadChats();
  }, [dispatch]);

  // ✅ Socket connections
 



  // ✅ Fix: set user from localStorage (and remove Guest)
 // ✅ SOCKET + USER FIX
useEffect(() => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // Parse user
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  // Set user in state
  if (parsedUser) {
    setUser(parsedUser);
  } else {
    setUser(null);
  }

  // Initialize socket if token exists
  if (token) {
    initSocket(token);
    const socket = getSocket();

    socket.on("connect", () => console.log("✅ Connected as:", socket.id));
    socket.on("disconnect", () => console.warn("⚠️ Disconnected from server"));

    return () => {
      socket.off("connect");
      socket.off("disconnect"); 
      socket.disconnect();
    };
  }
}, []);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Handle New Chat
  const handleNewChat = () => {
    dispatch(clearCurrentChat());
    setShowNewChatModal(true);
  };

  const saveCurrentChat = async (title) => {
    try {
      const res = await instance.post("/chat", { title });
      const newChat = res.data.chat;
      dispatch(addChat(newChat));
      dispatch(setCurrentChat(newChat));
      setShowNewChatModal(false);
    } catch (err) {
      console.error("Error creating new chat:", err);
    }
  };

  const discardCurrentChat = () => {
    dispatch(clearCurrentChat());
    setShowNewChatModal(false);
  };

  // ✅ Handle Message Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    let chatId = currentChat?._id;

if (!chatId) {
  try {
    const res = await instance.post('/chat', { title: 'New Chat' });
    const newChat = res.data.chat;
    dispatch(addChat(newChat));
    dispatch(setCurrentChat(newChat));
    chatId = newChat._id; // ✅ make sure you use the freshly created one
  } catch (err) {
    console.error('Error creating chat:', err);
    return;
  }
}

const userMessage = inputMessage.trim();
setInputMessage('');
inputRef.current?.focus();

const userMessageObj = {
  id: Date.now(),
  text: userMessage,
  isAi: false,
  timestamp: new Date().toISOString()
};

dispatch(addMessage(userMessageObj));
dispatch(setLoading(true));

try {
  const res =await instance.post(`/messages/${chatId}/messages`, { content: userMessage });


  const aiMessage = {
    id: Date.now(),
    text: res.data.content,
    isAi: true,
    timestamp: new Date().toISOString()
  };

  dispatch(addMessage(aiMessage));
  
      if (messages.length === 0) {
        try {
          const titleRes = await instance.post('/chat/generate-title', {
            chatId: currentChat._id,
            userMessage,
            aiMessage: aiMessage.text
          });
          dispatch(updateChatTitle({
            chatId: currentChat._id,
            title: titleRes.data.title
          }));
        } catch (err) {
          const fallbackTitle =
            userMessage.length > 30
              ? userMessage.slice(0, 30) + '...'
              : userMessage;
          dispatch(
            updateChatTitle({
              chatId: currentChat._id,
              title: fallbackTitle
            })
          );
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      dispatch(
        addMessage({
          id: Date.now(),
          text: 'Sorry, I encountered an error. Please try again.',
          isAi: true,
          timestamp: new Date().toISOString()
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

   
  return (
    <div className={`home-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar
        chats={chats}
        currentChat={currentChat}
        onChatSelect={(chat) => dispatch(setCurrentChat(chat))}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
        onNewChat={handleNewChat}
        user={user}
      />
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Dim chat area when popup visible */}
      <div
        className="chat-content"
        style={{
          pointerEvents: showInstruction ? 'none' : 'auto',
          opacity: showInstruction ? 0.4 : 1
        }}
      >
        <div className="chat-header">
          <button
            className="menu-toggle"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span className="menu-icon"></span>
          </button>
          <div className="header-content">
            <div className="bot-info">
              <div className="bot-avatar">🤖</div>
              <span className="bot-name">
                {currentChat ? currentChat.title : 'GeeGo Bot'}
              </span>
            </div>
          </div>
        </div>

        <div className="messages-container" ref={messagesContainerRef}>
          {messages.map((msg, idx) => (
            <ChatMessage key={msg.id || idx} message={msg.text} isAi={msg.isAi} />
          ))}
          {isLoading && <ChatMessage message="Thinking..." isAi={true} />}
          <div ref={messagesEndRef} style={{ height: 1, width: 1 }} />
        </div>

        <form className="input-container" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your message here..."
            disabled={isLoading}
            autoComplete="off"
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </div>

      {/* ✅ Instruction Popup */}
      {showInstruction && (
        <div className="instruction-popup">
          <div className="instruction-box">
            <h2>👋 Welcome!</h2>
            <p>To start chatting:</p>
            <ol>
              <li>🔑 First, login to your account</li>
              <li>💬 Then, create a new chat</li>
              <li>🚀 Finally, start messaging GeeGo Bot!</li>
            </ol>
            <button className="close-btn" onClick={() => setShowInstruction(false)}>
              Got it
            </button>
          </div>
        </div>
      )}

      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onSave={saveCurrentChat}
        onDiscard={discardCurrentChat}
      />
    </div>
  );
};

export default Home;
