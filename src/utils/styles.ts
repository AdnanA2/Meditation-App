import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Common button styles
export const buttonStyles = {
  base: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
  outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500',
  ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  sizes: {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg'
  }
};

// Common input styles
export const inputStyles = {
  base: 'block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500'
};

// Common card styles
export const cardStyles = {
  base: 'rounded-lg bg-white shadow-sm',
  hover: 'hover:shadow-md transition-shadow duration-200',
  interactive: 'cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1'
};

// Common container styles
export const containerStyles = {
  base: 'mx-auto px-4 sm:px-6 lg:px-8',
  narrow: 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8',
  wide: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
};

// Common text styles
export const textStyles = {
  h1: 'text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl',
  h2: 'text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl',
  h3: 'text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl',
  h4: 'text-xl font-bold tracking-tight text-gray-900 sm:text-2xl',
  body: 'text-base text-gray-600',
  small: 'text-sm text-gray-500',
  muted: 'text-gray-500'
};

// Common spacing styles
export const spacingStyles = {
  section: 'py-12 sm:py-16 lg:py-20',
  container: 'space-y-8',
  stack: 'space-y-4',
  inline: 'space-x-4'
};

// Common animation classes
export const animationStyles = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  scaleIn: 'animate-scale-in',
  pulse: 'animate-pulse'
};

// Common layout styles
export const layoutStyles = {
  grid: {
    base: 'grid gap-4',
    cols2: 'grid-cols-1 sm:grid-cols-2',
    cols3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  },
  flex: {
    base: 'flex',
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end'
  }
};

// Common responsive styles
export const responsiveStyles = {
  hideOnMobile: 'hidden sm:block',
  showOnMobile: 'block sm:hidden',
  fullWidth: 'w-full',
  maxWidth: 'max-w-full'
};

// Common accessibility styles
export const accessibilityStyles = {
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
  srOnly: 'sr-only',
  skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-black'
}; 