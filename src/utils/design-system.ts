/**
 * Design System Constants
 * Centralized design tokens for consistent styling across the app
 */

export const SPACING = {
  xs: '0.25rem',    // 1
  sm: '0.5rem',     // 2
  md: '1rem',       // 4
  lg: '1.5rem',     // 6
  xl: '2rem',       // 8
  '2xl': '3rem',    // 12
  '3xl': '4rem',    // 16
} as const;

export const COLORS = {
  primary: {
    50: 'rgb(238 242 255)',
    100: 'rgb(224 231 255)',
    500: 'rgb(99 102 241)',
    600: 'rgb(79 70 229)',
    700: 'rgb(67 56 202)',
  },
  secondary: {
    50: 'rgb(249 250 251)',
    100: 'rgb(243 244 246)',
    500: 'rgb(107 114 128)',
    600: 'rgb(75 85 99)',
    700: 'rgb(55 65 81)',
  },
  success: 'rgb(34 197 94)',
  warning: 'rgb(245 158 11)',
  error: 'rgb(239 68 68)',
} as const;

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
} as const;

export const BORDER_RADIUS = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

export const TRANSITIONS = {
  fast: '150ms ease-in-out',
  normal: '300ms ease-in-out',
  slow: '500ms ease-in-out',
} as const;

/**
 * Common component style patterns
 */
export const COMPONENT_STYLES = {
  card: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-700/30 transition-all duration-300 hover:shadow-2xl',
  
  button: {
    base: 'rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-indigo-500',
    secondary: 'bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-md hover:shadow-lg focus:ring-gray-500',
  },
  
  input: 'px-4 py-3 rounded-xl border border-gray-300/50 dark:border-gray-600/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300',
  
  glass: 'bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border border-white/20 dark:border-gray-700/20',
} as const;

/**
 * Animation classes
 */
export const ANIMATIONS = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  scaleIn: 'animate-scale-in',
  breathIn: 'animate-breath-in',
  breathOut: 'animate-breath-out',
} as const;

/**
 * Responsive breakpoints
 */
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const; 