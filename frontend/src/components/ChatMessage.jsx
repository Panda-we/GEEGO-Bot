import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import "../styles/chat.css";

export const ChatMessage = ({ text, role }) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null);

  if (!text) return null;

  const isAi = role === "model";

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLike = (type) => {
    setLiked(type === liked ? null : type);
  };

  const roleClass = role === "system" ? "system" : isAi ? "ai" : "user";
  const avatar = role === "system" ? "⚙️" : isAi ? "🤖" : "👤";

  return (
    <div className={`chat-message ${roleClass}`}>
      <div className="message-avatar">{avatar}</div>

      <div className="message-content">
        {role === "system" ? (
          <p className="system-text"><em>{text}</em></p>
        ) : isAi ? (
          <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]} skipHtml>
            {text}
          </ReactMarkdown>
        ) : (
          <p>{text}</p>
        )}

        {isAi && (
          <div className="message-actions">
            <button
              className={`action-btn ${copied ? "copied" : ""}`}
              onClick={handleCopy}
              aria-label="Copy message"
              title="Copy"
            >
              <Copy size={16} />
              {copied && <span className="tooltip">Copied!</span>}
            </button>

            <button
              className={`action-btn ${liked === "up" ? "active" : ""}`}
              onClick={() => handleLike("up")}
              aria-label="Like message"
              title="Like"
            >
              <ThumbsUp size={16} />
            </button>

            <button
              className={`action-btn ${liked === "down" ? "active" : ""}`}
              onClick={() => handleLike("down")}
              aria-label="Dislike message"
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
