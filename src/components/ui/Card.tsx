import React, { forwardRef } from 'react';
import type { ReactNode } from 'react';

/**
 * A flexible card component with glass morphism styling and responsive layout.
 * Supports both light and dark themes with consistent spacing and visual hierarchy.
 * 
 * @example
 * ```tsx
 * <Card className="custom-styles">
 *   <h2>Card Title</h2>
 *   <p>Card content...</p>
 * </Card>
 * ```
 */
interface CardProps {
  /** Card content */
  children: ReactNode;
  /** Additional CSS classes to apply */
  className?: string;
  /** Optional role for accessibility */
  role?: string;
  /** Optional aria-label for screen readers */
  'aria-label'?: string;
  /** Optional aria-labelledby for screen readers */
  'aria-labelledby'?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className = '', 
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref} 
      className={`w-full max-w-md mx-auto p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-700/30 transition-all duration-300 hover:shadow-2xl ${className}`}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      {...props}
    >
      {children}
    </div>
  );
}); 

Card.displayName = 'Card'; 