import { logger } from './logger';
import { settingsManager } from './settings';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number; // in milliseconds
  action?: {
    label: string;
    onClick: () => void;
  };
}

class NotificationManager {
  private static instance: NotificationManager;
  private notifications: Map<string, Notification> = new Map();
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    // Check if browser supports notifications
    if ('Notification' in window) {
      this.requestPermission();
    }
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  private async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      logger.info('Notification permission status', { permission });
    } catch (error) {
      logger.error('Failed to request notification permission', error as Error);
    }
  }

  private notifyListeners() {
    const notifications = Array.from(this.notifications.values());
    this.listeners.forEach(listener => listener(notifications));
  }

  show(notification: Omit<Notification, 'id'>): string {
    const id = crypto.randomUUID();
    const fullNotification = { ...notification, id };

    this.notifications.set(id, fullNotification);
    this.notifyListeners();

    // Show browser notification if enabled
    if (settingsManager.areNotificationsEnabled() && 'Notification' in window) {
      this.showBrowserNotification(fullNotification);
    }

    // Auto-dismiss if duration is set
    if (notification.duration) {
      const timeout = setTimeout(() => {
        this.dismiss(id);
      }, notification.duration);

      this.timeouts.set(id, timeout);
    }

    logger.info('Notification shown', { id, type: notification.type });
    return id;
  }

  private showBrowserNotification(notification: Notification) {
    if (Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/icons/notification-icon.png'
      });

      browserNotification.onclick = () => {
        window.focus();
        notification.action?.onClick();
      };
    }
  }

  dismiss(id: string): void {
    const notification = this.notifications.get(id);
    if (!notification) return;

    this.notifications.delete(id);
    this.notifyListeners();

    const timeout = this.timeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(id);
    }

    logger.info('Notification dismissed', { id });
  }

  dismissAll(): void {
    this.notifications.clear();
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
    this.notifyListeners();
    logger.info('All notifications dismissed');
  }

  addChangeListener(listener: (notifications: Notification[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getNotifications(): Notification[] {
    return Array.from(this.notifications.values());
  }

  // Convenience methods for common notification types
  showInfo(message: string, title: string = 'Information'): string {
    return this.show({
      title,
      message,
      type: 'info',
      duration: 5000
    });
  }

  showSuccess(message: string, title: string = 'Success'): string {
    return this.show({
      title,
      message,
      type: 'success',
      duration: 5000
    });
  }

  showWarning(message: string, title: string = 'Warning'): string {
    return this.show({
      title,
      message,
      type: 'warning',
      duration: 7000
    });
  }

  showError(message: string, title: string = 'Error'): string {
    return this.show({
      title,
      message,
      type: 'error',
      duration: 10000
    });
  }

  showMeditationReminder(): string {
    return this.show({
      title: 'Time to Meditate',
      message: 'Take a moment to breathe and find your center.',
      type: 'info',
      duration: 10000,
      action: {
        label: 'Start Session',
        onClick: () => {
          // Navigate to meditation page or start session
          window.location.href = '/meditate';
        }
      }
    });
  }

  showAchievementUnlocked(title: string, description: string): string {
    return this.show({
      title: `Achievement Unlocked: ${title}`,
      message: description,
      type: 'success',
      duration: 8000
    });
  }

  showStreakReminder(currentStreak: number): string {
    return this.show({
      title: 'Keep Your Streak!',
      message: `You're on a ${currentStreak}-day meditation streak. Don't break the chain!`,
      type: 'info',
      duration: 8000,
      action: {
        label: 'Meditate Now',
        onClick: () => {
          window.location.href = '/meditate';
        }
      }
    });
  }
}

export const notificationManager = NotificationManager.getInstance(); 