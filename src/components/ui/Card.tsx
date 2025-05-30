import React, { forwardRef } from 'react';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className = '' }, ref) => {
  return (
    <div 
      ref={ref} 
      className={`w-full max-w-md mx-auto p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-700/30 transition-all duration-300 hover:shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
}); 