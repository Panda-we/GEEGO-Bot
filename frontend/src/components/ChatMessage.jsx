import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import "../styles/chat.css";

export const ChatMessage = ({ message, isAi, typing = false }) => {
  const text = typeof message === "string" ? message : message?.text || "";
  
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleLike = (type) => {
    setLiked(type === liked ? null : type);
  };

  return (
    <div className={`chat-message ${isAi ? "ai" : "user"}`}>
      <div className="message-avatar">{isAi ? "🤖" : "👤"}</div>

      <div className="message-content">
        {isAi ? (
          typing ? (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          )
        ) : (
          <p>{text}</p>
        )}

        {isAi && !typing && (
          <div className="message-actions">
            <button
              className={`action-btn ${copied ? "copied" : ""}`}
              onClick={handleCopy}
            >
              <Copy size={16} />
              {copied && <span className="tooltip">Copied!</span>}
            </button>

            <button
              className={`action-btn ${liked === "up" ? "active" : ""}`}
              onClick={() => handleLike("up")}
              title="Like"
            >
              <ThumbsUp size={16} />
            </button>

            <button
              className={`action-btn ${liked === "down" ? "active" : ""}`}
              onClick={() => handleLike("down")}
              title="Dislike"
            >
              <ThumbsDown size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
