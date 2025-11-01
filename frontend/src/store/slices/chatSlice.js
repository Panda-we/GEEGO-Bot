import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [],
  currentChat: null,
  activeChat: null,
  messages: [],
  isLoading: false,
  error: null,
  unsavedChanges: false
};

// Normalizer utility
const normalizeMessage = (msg) => ({
  id: msg.id || msg._id || Date.now().toString(),
  text: msg.text || msg.content || "",
  role: msg.role || (msg.isAi ? "model" : "user"),
  timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
});

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    addChat: (state, action) => {
      state.chats.unshift(action.payload);
      state.currentChat = action.payload;
      state.activeChat = action.payload.id || action.payload._id;
      state.messages = [];
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
      state.activeChat = action.payload.id || action.payload._id;
      state.messages = (action.payload.messages || []).map(normalizeMessage);
    },
    updateChatTitle: (state, action) => {
      const { chatId, title } = action.payload;
      const chat = state.chats.find(c => c.id === chatId || c._id === chatId);
      if (chat) {
        chat.title = title;
        if (state.currentChat?.id === chatId || state.currentChat?._id === chatId) {
          state.currentChat.title = title;
        }
      }
    },
    addMessage: (state, action) => {
      const normalized = normalizeMessage(action.payload);
      state.messages.push(normalized);
      if (state.currentChat) {
        state.currentChat.messages = state.messages;
        state.currentChat.lastMessage = normalized.text;
        state.currentChat.updatedAt = new Date().toISOString();
      }
      state.unsavedChanges = true;
    },
    setMessages: (state, action) => {
      state.messages = action.payload.map(normalizeMessage);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearCurrentChat: (state) => {
      state.currentChat = null;
      state.activeChat = null;
      state.messages = [];
      state.unsavedChanges = false;
    },
    markChangesSaved: (state) => {
      state.unsavedChanges = false;
    },
    deleteChat: (state, action) => {
      state.chats = state.chats.filter(chat => chat.id !== action.payload && chat._id !== action.payload);
      if (state.currentChat?.id === action.payload || state.currentChat?._id === action.payload) {
        state.currentChat = null;
        state.activeChat = null;
        state.messages = [];
      }
    }
  }
});

export const {
  setChats,
  addChat,
  setCurrentChat,
  updateChatTitle,
  addMessage,
  setMessages,
  setLoading,
  setError,
  clearCurrentChat,
  markChangesSaved,
  deleteChat
} = chatSlice.actions;

// Selectors
export const selectChats = (state) => state.chat.chats;
export const selectCurrentChat = (state) => state.chat.currentChat;
export const selectActiveChat = (state) => state.chat.activeChat;
export const selectMessages = (state) => state.chat.messages;
export const selectIsLoading = (state) => state.chat.isLoading;
export const selectError = (state) => state.chat.error;
export const selectUnsavedChanges = (state) => state.chat.unsavedChanges;

export default chatSlice.reducer;
