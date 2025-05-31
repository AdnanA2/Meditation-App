import type { ReactNode } from 'react';

/**
 * A wrapper component for consistent icon styling and presentation.
 * Provides standardized sizing, colors, and hover effects for icons.
 * 
 * @example
 * ```tsx
 * <IconWrapper variant="primary" size="lg">
 *   🎯
 * </IconWrapper>
 * ```
 */
interface IconWrapperProps {
  /** Icon content (emoji, SVG, or other ReactNode) */
  children: ReactNode;
  /** Visual style variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional CSS classes */
  className?: string;
  /** Whether the icon should have hover effects */
  interactive?: boolean;
  /** Optional click handler for interactive icons */
  onClick?: () => void;
  /** Optional aria-label for screen readers */
  'aria-label'?: string;
}

export const IconWrapper = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  interactive = false,
  onClick,
  'aria-label': ariaLabel,
  ...props 
}: IconWrapperProps) => {
  const baseStyles = 'rounded-full flex items-center justify-center transition-all duration-300';
  
  const sizeStyles = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-20 h-20 text-4xl'
  };
  
  const variantStyles = {
    default: 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300',
    primary: 'bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-600 dark:text-indigo-400',
    success: 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-600 dark:text-green-400',
    warning: 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50 text-yellow-600 dark:text-yellow-400',
    danger: 'bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50 text-red-600 dark:text-red-400',
    info: 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 text-blue-600 dark:text-blue-400'
  };

  const interactiveStyles = interactive 
    ? 'cursor-pointer hover:scale-110 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/50' 
    : '';

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}; 