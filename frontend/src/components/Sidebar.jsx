import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import '../styles/chat.css';
import instance from '../utils/axios';
import { getSocket } from "../utils/socket"; 

export const Sidebar = ({
  chats,
  currentChat,
  onChatSelect,
  onToggle,
  isOpen,
  onNewChat,
  user,
}) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  

const handleLogout = async () => {
  try {
    const socket = getSocket();
    if (socket) socket.disconnect();

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  } catch (err) {
    console.error("Logout failed:", err);
  }
};


  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-top">
          <h2>GeeGo Bot</h2>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Mobile close button */}
          <button className="sidebar-close" onClick={onToggle}>
            ✖
          </button>
        </div>

        {/* New Chat */}
        <button className="new-chat-btn" onClick={onNewChat}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Chat list */}
      <div className="sidebar-content">
        <div className="chats-list">
          {Array.isArray(chats) && chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat._id}
                className={`chat-item ${
                  chat._id === currentChat?._id ? "active" : ""
                }`}
              >
                <div className="chat-info" onClick={() => onChatSelect(chat)}>
                  <span className="chat-title">{chat.title}</span>
                  <span className="chat-date">
                    {chat.updatedAt
                      ? new Date(chat.updatedAt).toLocaleString()
                      : "Just now"}
                  </span>
                </div>

                {/* Delete Chat */}
                <button
                  className="delete-chat-btn"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete chat "${chat.title}"?`)) {
                      try {
                        await instance.delete(`/chat/${chat._id}`);
                        window.location.reload();
                      } catch (err) {
                        console.error("Error deleting chat:", err);
                      }
                    }
                  }}
                  aria-label="Delete Chat"
                >
                  🗑️
                </button>
              </div>
            ))
          ) : (
            <div className="no-chats">No previous chats</div>
          )}
        </div>
      </div>

      {/* Footer (Profile Section) */}
      <div className="sidebar-footer">
        <div className="user-profile">
          {user ? (
            <>
              <div className="profile-info">
                <div className="avatar gradient-avatar">
                  {user.fullName?.firstName
                    ? user.fullName.firstName[0].toUpperCase()
                    : "U"}
                </div>
                <div className="user-details">
                  <span className="user-name">
                    {user.fullName?.firstName || "User"}
                  </span>
                  <span className="user-email">{user.email}</span>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="profile-info">
                <div className="avatar gradient-avatar">?</div>
                <div className="user-details">
                  <span className="user-name">Guest</span>
                  <span className="user-email">Please sign in</span>
                </div>
              </div>
              <button
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
