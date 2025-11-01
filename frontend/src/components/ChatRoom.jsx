import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChatMessage } from './ChatMessage';
import { socket } from '../utils/socket';
import instance from '../utils/axios';
import {
  selectCurrentChat,
  selectMessages,
  setMessages,
  addMessage,
  setLoading,
  updateChatTitle
} from '../store/slices/chatSlice';

export const ChatRoom = () => {
  const dispatch = useDispatch();
  const currentChat = useSelector(selectCurrentChat);
  const messages = useSelector(selectMessages);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  }, [messages]);

  // Load existing messages
  useEffect(() => {
    if (!currentChat?._id) return;
    instance.get(`/chat/${currentChat._id}/messages`)
      .then(res => {
        const formatted = res.data.data.map(msg => ({
          id: msg._id,
          text: msg.content,
          isAi: msg.role === 'model',
          timestamp: msg.createdAt
        }));
        dispatch(setMessages(formatted));
      })
      .catch(err => console.error('Error fetching messages:', err));
  }, [currentChat, dispatch]);

  // Listen for AI response
  useEffect(() => {
    socket.on('ai-response', (data) => {
      // Replace "Thinking..." placeholder if exists
      dispatch(addMessage({
        id: Date.now(),
        text: data.content,
        isAi: true,
        timestamp: new Date().toISOString()
      }));
    });
    return () => socket.off('ai-response');
  }, [dispatch]);

  // Handle send
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentChat?._id) return;

    const userMessage = input.trim();
    setInput('');

    // 👇 Instantly show user message
    dispatch(addMessage({
      id: Date.now(),
      text: userMessage,
      isAi: false,
      timestamp: new Date().toISOString()
    }));

    // 👇 Add temporary "Thinking..." AI placeholder
    const tempId = `thinking-${Date.now()}`;
    dispatch(addMessage({
      id: tempId,
      text: 'Thinking...',
      isAi: true,
      timestamp: new Date().toISOString()
    }));

    try {
      await instance.post(`/chat/${currentChat._id}/messages`, {
        content: userMessage
      });

      socket.emit('ai-message', {
        chat: currentChat._id,
        content: userMessage
      });

      // Generate title for new chat
      if (messages.length === 0) {
        const titleRes = await instance.post('/chat/generate-title', {
          chatId: currentChat._id,
          userMessage,
          aiMessage: '...'
        });
        dispatch(updateChatTitle({
          chatId: currentChat._id,
          title: titleRes.data.title
        }));
      }
    } catch (err) {
      console.error('Message send failed:', err);
    }
  };

  return (
    <div className="chat-room">
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <ChatMessage key={msg.id || idx} message={msg.text} isAi={msg.isAi} />
        ))}
        <div ref={messagesEndRef} style={{ height: 1 }} />
      </div>

      <form className="input-container" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          autoFocus
          autoComplete="off"
        />
        <button type="submit" disabled={!input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};
