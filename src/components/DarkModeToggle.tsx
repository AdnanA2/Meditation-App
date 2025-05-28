import { useState, useEffect } from 'react';
import { getInitialTheme, toggleTheme, type Theme } from '../utils/theme';

export const DarkModeToggle = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme());

  useEffect(() => {
    // Apply theme on mount
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <span className="text-xl" role="img" aria-hidden="true">🌙</span>
      ) : (
        <span className="text-xl" role="img" aria-hidden="true">🌞</span>
      )}
    </button>
  );
}; 