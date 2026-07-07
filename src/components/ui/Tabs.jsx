import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Tabs.css';

export function Tabs({ tabs, defaultTab, activeTab: controlledTab, onChange, className = '' }) {
  const [internalTab, setInternalTab] = useState(defaultTab || tabs[0]?.id);
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;

  const handleTabClick = (id) => {
    if (controlledTab === undefined) {
      setInternalTab(id);
    }
    if (onChange) onChange(id);
  };

  return (
    <div className={`premium-tabs ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`premium-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => handleTabClick(tab.id)}
        >
          {tab.icon && <span className="premium-tab-icon">{tab.icon}</span>}
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId={`tab-indicator-${className || 'default'}`}
              className="premium-tab-indicator"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

export function TabsContent({ activeTab, children }) {
  return (
    <div className="premium-tabs-content">
      <AnimatePresence mode="wait">
        {React.Children.map(children, (child) => {
          if (!child || !child.props) return null;
          if (child.props.id === activeTab) {
            return (
              <motion.div
                key={child.props.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {child}
              </motion.div>
            );
          }
          return null;
        })}
      </AnimatePresence>
    </div>
  );
}

export function TabPane({ children }) {
  return <div className="premium-tab-pane">{children}</div>;
}
