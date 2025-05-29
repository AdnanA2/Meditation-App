import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}; 