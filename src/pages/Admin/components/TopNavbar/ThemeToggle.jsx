import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import IconButton from './IconButton.jsx';

function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Future: implement context logic to actually toggle document class
  };

  return (
    <IconButton icon={isDark ? Moon : Sun} onClick={toggleTheme} />
  );
}

export default ThemeToggle;
