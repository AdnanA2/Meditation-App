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
      className="p-2.5 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'light' ? (
          <span className="text-xl transition-transform duration-300 hover:rotate-12" role="img" aria-hidden="true">🌙</span>
        ) : (
          <span className="text-xl transition-transform duration-300 hover:rotate-12" role="img" aria-hidden="true">🌞</span>
        )}
      </div>
    </button>
  );
}; 