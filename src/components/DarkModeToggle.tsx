/**
 * Dark mode toggle button component
 * 
 * Provides a smooth toggle between light and dark themes with animated icons
 * and proper accessibility support.
 * 
 * @component
 * @example
 * ```tsx
 * <DarkModeToggle />
 * ```
 */

import { useState, useEffect } from 'react';
import { getInitialTheme, toggleTheme, type Theme } from '../utils/theme';

export const DarkModeToggle = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme());
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Apply theme on mount and changes
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleToggle = () => {
    if (isAnimating) return; // Prevent rapid clicking during animation
    
    setIsAnimating(true);
    const newTheme = toggleTheme();
    setTheme(newTheme);
    
    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300);
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={handleToggle}
      disabled={isAnimating}
      className="
        relative p-2 sm:p-2.5 rounded-full 
        hover:bg-gray-100/80 dark:hover:bg-gray-700/80 
        transition-all duration-300 
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-white/50 dark:focus:ring-offset-gray-900/50
        disabled:opacity-50 disabled:cursor-not-allowed
        group
      "
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center overflow-hidden">
        {/* Light mode icon (sun) */}
        <span 
          className={`
            absolute text-lg sm:text-xl transition-all duration-500 ease-in-out
            ${isDark 
              ? 'opacity-0 scale-0 rotate-180' 
              : 'opacity-100 scale-100 rotate-0 group-hover:rotate-12'
            }
          `}
          role="img" 
          aria-hidden="true"
        >
          🌞
        </span>
        
        {/* Dark mode icon (moon) */}
        <span 
          className={`
            absolute text-lg sm:text-xl transition-all duration-500 ease-in-out
            ${isDark 
              ? 'opacity-100 scale-100 rotate-0 group-hover:-rotate-12' 
              : 'opacity-0 scale-0 -rotate-180'
            }
          `}
          role="img" 
          aria-hidden="true"
        >
          🌙
        </span>
        
        {/* Loading indicator during animation */}
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-600/20 opacity-0 group-active:opacity-100 transition-opacity duration-150" />
    </button>
  );
}; 