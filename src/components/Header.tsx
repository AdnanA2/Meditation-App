/**
 * Header component with app title, settings button, and dark mode toggle
 * 
 * @component
 * @example
 * ```tsx
 * <Header onSettingsClick={() => setSettingsOpen(true)} />
 * ```
 */

import { DarkModeToggle } from './DarkModeToggle';
import { useEffect, useState } from 'react';
import { applyTheme, getInitialTheme } from '../utils/theme';

interface HeaderProps {
  /** Callback function when settings button is clicked */
  onSettingsClick: () => void;
}

export const Header = ({ onSettingsClick }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Apply initial theme on mount
    applyTheme(getInitialTheme());

    // Handle scroll effect for header
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/30 dark:border-gray-700/30 shadow-lg' 
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20'
        }
      `}
      role="banner"
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* App Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
            <span className="text-white text-xl font-bold">🧘</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-light text-gray-800 dark:text-white tracking-wide transition-all duration-300 hover:text-indigo-600 dark:hover:text-indigo-400">
            <span className="hidden sm:inline">Meditation App</span>
            <span className="sm:hidden">Meditate</span>
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onSettingsClick}
            className="
              p-2.5 rounded-full text-gray-600 dark:text-gray-300 
              hover:bg-gray-100/80 dark:hover:bg-gray-700/80 
              transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-white/50 dark:focus:ring-offset-gray-900/50
              hover:scale-105 active:scale-95
              group
            "
            aria-label="Open settings"
            title="Settings"
          >
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}; 