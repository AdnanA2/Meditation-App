import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from './logger';
import { analyticsManager } from './analytics';
import { notificationManager } from './notifications';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    logger.error('Error caught by boundary', error, {
      componentStack: errorInfo.componentStack
    });

    // Track the error in analytics
    analyticsManager.trackError(error, 'ErrorBoundary');

    // Show error notification
    notificationManager.showError(
      'Something went wrong. Please try refreshing the page.',
      'Application Error'
    );

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Utility function to wrap async functions with error handling
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      logger.error(`Error in ${context || 'async function'}`, error as Error);
      analyticsManager.trackError(error as Error, context);
      throw error;
    }
  }) as T;
}

// Utility function to create error messages
export function createErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

// Utility function to handle API errors
export function handleApiError(error: unknown, context?: string): void {
  const message = createErrorMessage(error);
  logger.error(`API Error in ${context || 'API call'}`, error as Error);
  analyticsManager.trackError(error as Error, context);
  notificationManager.showError(message);
}

// Utility function to handle form validation errors
export function handleValidationError(error: unknown, fieldName?: string): void {
  const message = createErrorMessage(error);
  logger.warn('Validation error', { fieldName, error });
  notificationManager.showWarning(
    fieldName ? `${fieldName}: ${message}` : message,
    'Validation Error'
  );
}

// Utility function to handle network errors
export function handleNetworkError(error: unknown): void {
  const message = createErrorMessage(error);
  logger.error('Network error', error as Error);
  analyticsManager.trackError(error as Error, 'Network');
  notificationManager.showError(
    'Please check your internet connection and try again.',
    'Network Error'
  );
}

// Utility function to handle permission errors
export function handlePermissionError(error: unknown, permission: string): void {
  const message = createErrorMessage(error);
  logger.warn('Permission error', { permission, error });
  notificationManager.showWarning(
    `Please grant ${permission} permission to continue.`,
    'Permission Required'
  );
}

// Utility function to handle storage errors
export function handleStorageError(error: unknown): void {
  const message = createErrorMessage(error);
  logger.error('Storage error', error as Error);
  analyticsManager.trackError(error as Error, 'Storage');
  notificationManager.showError(
    'Failed to save data. Please try again.',
    'Storage Error'
  );
}

// Utility function to handle authentication errors
export function handleAuthError(error: unknown): void {
  const message = createErrorMessage(error);
  logger.error('Authentication error', error as Error);
  analyticsManager.trackError(error as Error, 'Authentication');
  notificationManager.showError(
    'Please sign in again to continue.',
    'Authentication Error'
  );
}

// Utility function to handle feature availability errors
export function handleFeatureError(feature: string): void {
  logger.warn('Feature not available', { feature });
  notificationManager.showWarning(
    `${feature} is not available in your current plan.`,
    'Feature Unavailable'
  );
}

// Utility function to handle rate limiting errors
export function handleRateLimitError(error: unknown): void {
  const message = createErrorMessage(error);
  logger.warn('Rate limit exceeded', { error });
  notificationManager.showWarning(
    'Please wait a moment before trying again.',
    'Rate Limit Exceeded'
  );
}

// Utility function to handle timeout errors
export function handleTimeoutError(error: unknown): void {
  const message = createErrorMessage(error);
  logger.error('Operation timed out', error as Error);
  analyticsManager.trackError(error as Error, 'Timeout');
  notificationManager.showError(
    'The operation took too long to complete. Please try again.',
    'Timeout Error'
  );
} 