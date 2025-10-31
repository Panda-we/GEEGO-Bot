import React, { useState } from "react";
import "../styles/modal.css";

export const NewChatModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return alert("Please enter a chat title");
    onSave(title.trim());
    setTitle("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">🗨️ New Chat</h2>
        <p className="modal-subtitle">Enter a name for your new chat</p>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project Name..."
          className="modal-input"
        />

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
