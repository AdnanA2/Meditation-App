import type { ReactNode } from 'react';

/**
 * A flexible badge component for displaying status indicators, counts, and labels.
 * Supports multiple variants and sizes with consistent theming.
 * 
 * @example
 * ```tsx
 * <Badge variant="success" size="sm">
 *   New
 * </Badge>
 * ```
 */
interface BadgeProps {
  /** Badge content */
  children: ReactNode;
  /** Visual style variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
  /** Optional role for accessibility */
  role?: string;
  /** Optional aria-label for screen readers */
  'aria-label'?: string;
}

export const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '',
  role,
  'aria-label': ariaLabel,
  ...props 
}: BadgeProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200';
  
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const variantStyles = {
    default: 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/50',
    primary: 'bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-700/50',
    success: 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-700 dark:text-green-300 border border-green-200/50 dark:border-green-700/50',
    warning: 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50 text-yellow-700 dark:text-yellow-300 border border-yellow-200/50 dark:border-yellow-700/50',
    danger: 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50 text-red-700 dark:text-red-300 border border-red-200/50 dark:border-red-700/50',
    info: 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50'
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      role={role}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </span>
  );
}; 