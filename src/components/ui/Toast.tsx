import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { COMPONENT_STYLES, ANIMATIONS } from '../../utils/design-system';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-50 space-y-2 max-w-sm"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getToastStyles = () => {
    const baseStyles = `${COMPONENT_STYLES.card} p-4 transition-all duration-300 transform`;
    const visibilityStyles = isVisible 
      ? 'translate-x-0 opacity-100 scale-100' 
      : 'translate-x-full opacity-0 scale-95';

    const typeStyles = {
      success: 'border-l-4 border-green-500 bg-green-50/90 dark:bg-green-900/20',
      error: 'border-l-4 border-red-500 bg-red-50/90 dark:bg-red-900/20',
      warning: 'border-l-4 border-yellow-500 bg-yellow-50/90 dark:bg-yellow-900/20',
      info: 'border-l-4 border-blue-500 bg-blue-50/90 dark:bg-blue-900/20',
    };

    return `${baseStyles} ${visibilityStyles} ${typeStyles[toast.type]}`;
  };

  const getIcon = () => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };
    return icons[toast.type];
  };

  return (
    <div 
      className={getToastStyles()}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start space-x-3">
        <span className="text-lg flex-shrink-0" role="img" aria-hidden="true">
          {getIcon()}
        </span>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {toast.message}
            </p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 mt-2 focus:outline-none focus:underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={handleRemove}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          aria-label="Dismiss notification"
        >
          <span className="text-lg">×</span>
        </button>
      </div>
    </div>
  );
};

// Convenience hooks for common toast types
export const useSuccessToast = () => {
  const { addToast } = useToast();
  return (title: string, message?: string) => 
    addToast({ type: 'success', title, message });
};

export const useErrorToast = () => {
  const { addToast } = useToast();
  return (title: string, message?: string) => 
    addToast({ type: 'error', title, message });
};

export const useAchievementToast = () => {
  const { addToast } = useToast();
  return (title: string, description: string) => 
    addToast({ 
      type: 'success', 
      title: `🏆 ${title}`, 
      message: description,
      duration: 8000 
    });
}; 