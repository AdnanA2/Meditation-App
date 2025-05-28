import { DarkModeToggle } from './DarkModeToggle';
import { useEffect } from 'react';
import { applyTheme, getInitialTheme } from '../utils/theme';

export const Header = () => {
  useEffect(() => {
    // Apply initial theme on mount
    applyTheme(getInitialTheme());
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-sm z-50">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Meditation App
        </h1>
        <div className="flex items-center space-x-4">
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}; 