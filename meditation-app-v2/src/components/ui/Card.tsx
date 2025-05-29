import { HTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        'rounded-2xl bg-white p-4 shadow-sm',
        'dark:bg-earth-800 dark:shadow-earth-900/20',
        'transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Card Header component
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

Card.Header = function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div
      className={twMerge(
        'mb-4 flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Card Content component
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

Card.Content = function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div
      className={twMerge(
        'space-y-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Card Footer component
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

Card.Footer = function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div
      className={twMerge(
        'mt-4 flex items-center justify-between border-t border-earth-200 pt-4',
        'dark:border-earth-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 