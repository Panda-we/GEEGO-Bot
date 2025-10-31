import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { useNavigate } from 'react-router-dom';
import '../styles/user-menu.css';

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const menuRef = useRef();
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button 
        className="user-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <div className="user-avatar">👤</div>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <div className="user-name">John Doe</div>
              <div className="user-email">john@example.com</div>
            </div>
          </div>
          
          <div className="menu-divider" />
          
          <button className="menu-item" onClick={toggleTheme}>
            <span>{theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}</span>
          </button>
          
          <button className="menu-item" onClick={() => navigate('/profile')}>
            <span>👤 Profile</span>
          </button>
          
          <button className="menu-item" onClick={handleLogout}>
            <span>🚪 Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};
