import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import './CommandPalette.css';

const COMMANDS = [
  { id: 'home', title: 'Go to Home', route: '/', icon: '🏠' },
  { id: 'courses', title: 'Explore Courses', route: '/courses', icon: '📚' },
  { id: 'about', title: 'About Us', route: '/about', icon: 'ℹ️' },
  { id: 'auth', title: 'Sign In / Sign Up', route: '/auth', icon: '🔐' },
  { id: 'admin', title: 'Admin Dashboard', route: '/admin', icon: '⚙️', adminOnly: true },
  { id: 'theme', title: 'Toggle Theme (Coming Soon)', action: 'theme', icon: '🌓' },
];

function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const user = JSON.parse(localStorage.getItem('sa_user') || 'null');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearch('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCommands = COMMANDS.filter((cmd) => {
    if (cmd.adminOnly && (!user || user.role !== 'admin')) return false;
    return cmd.title.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleExecute = (cmd) => {
    setIsOpen(false);
    if (cmd.route) {
      navigate(cmd.route);
    } else if (cmd.action === 'theme') {
      addToast('Theme toggling will be available soon!', 'info');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      handleExecute(filteredCommands[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="command-palette-overlay" onClick={() => setIsOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="command-palette-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="command-search-header">
              <span className="search-icon">🔍</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search courses, navigate, or run commands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="command-search-input"
              />
              <span className="esc-hint">ESC</span>
            </div>

            <div className="command-results">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => (
                  <div
                    key={cmd.id}
                    className={`command-item ${selectedIndex === idx ? 'selected' : ''}`}
                    onClick={() => handleExecute(cmd)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <span className="command-item-icon">{cmd.icon}</span>
                    <span className="command-item-title">{cmd.title}</span>
                    <span className="command-item-shortcut">
                      {idx === selectedIndex ? '↵' : ''}
                    </span>
                  </div>
                ))
              ) : (
                <div className="command-empty">No results found for "{search}"</div>
              )}
            </div>
            
            <div className="command-footer">
              <span>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate, <kbd>↵</kbd> to select</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;
