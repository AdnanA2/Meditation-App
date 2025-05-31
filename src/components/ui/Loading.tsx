/**
 * Loading component with various styles and sizes
 * 
 * Provides consistent loading indicators throughout the application
 * with different variants for different use cases.
 * 
 * @component
 * @example
 * ```tsx
 * <Loading variant="spinner" size="md" />
 * <Loading variant="dots" size="lg" text="Loading sessions..." />
 * <Loading variant="pulse" />
 * ```
 */

import React from 'react';

interface LoadingProps {
  /** Visual style variant */
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  /** Size of the loading indicator */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Optional loading text */
  text?: string;
  /** Additional CSS classes */
  className?: string;
  /** Center the loading indicator */
  centered?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  text,
  className = '',
  centered = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const containerClasses = `
    ${centered ? 'flex flex-col items-center justify-center' : 'flex items-center'}
    ${className}
  `;

  const renderSpinner = () => (
    <div
      className={`
        ${sizeClasses[size]} 
        border-2 border-gray-200 dark:border-gray-700 
        border-t-indigo-500 dark:border-t-indigo-400 
        rounded-full animate-spin
      `}
      role="status"
      aria-label="Loading"
    />
  );

  const renderDots = () => (
    <div className="flex space-x-1" role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'}
            bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce
          `}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={`
        ${sizeClasses[size]} 
        bg-indigo-500/20 dark:bg-indigo-400/20 
        rounded-full animate-pulse-slow
      `}
      role="status"
      aria-label="Loading"
    />
  );

  const renderSkeleton = () => (
    <div className="space-y-3 w-full" role="status" aria-label="Loading content">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
    </div>
  );

  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={containerClasses}>
      {renderLoadingIndicator()}
      {text && (
        <span 
          className={`
            ${textSizeClasses[size]} 
            text-gray-600 dark:text-gray-400 
            ${variant === 'skeleton' ? 'mt-4' : 'ml-3'}
            font-medium
          `}
        >
          {text}
        </span>
      )}
    </div>
  );
}; 