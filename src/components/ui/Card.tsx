import React, { forwardRef } from 'react';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className = '' }, ref) => {
  return (
    <div ref={ref} className={`w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}); 