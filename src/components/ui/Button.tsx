import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
}

export const Button = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}: ButtonProps) => {
  const baseStyles = 'rounded-full px-6 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-indigo-500',
    secondary: 'bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-md hover:shadow-lg focus:ring-gray-500',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}; 