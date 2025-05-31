import { logger } from './logger';
import { settingsManager } from './settings';

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

export interface UserProperties {
  userId?: string;
  sessionCount: number;
  totalDuration: number;
  lastSessionDate?: Date;
  currentStreak: number;
  longestStreak: number;
  preferredSessionType?: string;
  preferredDuration?: number;
  deviceType: string;
  platform: string;
  language: string;
}

class AnalyticsManager {
  private static instance: AnalyticsManager;
  private events: AnalyticsEvent[] = [];
  private userProperties: UserProperties;
  private isInitialized: boolean = false;

  private constructor() {
    this.userProperties = this.initializeUserProperties();
  }

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  private initializeUserProperties(): UserProperties {
    return {
      sessionCount: 0,
      totalDuration: 0,
      currentStreak: 0,
      longestStreak: 0,
      deviceType: this.getDeviceType(),
      platform: this.getPlatform(),
      language: settingsManager.getLanguage()
    };
  }

  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'unknown';

    const ua = window.navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private getPlatform(): string {
    if (typeof window === 'undefined') return 'unknown';

    const platform = window.navigator.platform;
    if (platform.includes('Win')) return 'windows';
    if (platform.includes('Mac')) return 'macos';
    if (platform.includes('Linux')) return 'linux';
    if (platform.includes('iPhone') || platform.includes('iPad')) return 'ios';
    if (platform.includes('Android')) return 'android';
    return 'other';
  }

  initialize(userId?: string): void {
    if (this.isInitialized) return;

    this.userProperties.userId = userId;
    this.isInitialized = true;
    logger.info('Analytics initialized', { userId });
  }

  trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      logger.warn('Analytics not initialized');
      return;
    }

    this.events.push({
      ...event,
      properties: {
        ...event.properties,
        timestamp: new Date().toISOString(),
        userId: this.userProperties.userId
      }
    });

    logger.debug('Event tracked', event);

    // In a real implementation, you would send this to your analytics service
    // For example: sendToAnalyticsService(event);
  }

  updateUserProperties(properties: Partial<UserProperties>): void {
    this.userProperties = {
      ...this.userProperties,
      ...properties
    };
    logger.info('User properties updated', properties);
  }

  // Convenience methods for common events
  trackSessionStart(sessionType: string, duration: number): void {
    this.trackEvent({
      category: 'Session',
      action: 'Start',
      label: sessionType,
      value: duration,
      properties: {
        sessionType,
        duration
      }
    });
  }

  trackSessionComplete(sessionType: string, duration: number): void {
    this.trackEvent({
      category: 'Session',
      action: 'Complete',
      label: sessionType,
      value: duration,
      properties: {
        sessionType,
        duration
      }
    });
  }

  trackSessionCancel(sessionType: string, duration: number): void {
    this.trackEvent({
      category: 'Session',
      action: 'Cancel',
      label: sessionType,
      value: duration,
      properties: {
        sessionType,
        duration
      }
    });
  }

  trackAchievementUnlocked(achievementId: string, title: string): void {
    this.trackEvent({
      category: 'Achievement',
      action: 'Unlock',
      label: title,
      properties: {
        achievementId,
        title
      }
    });
  }

  trackStreakUpdate(currentStreak: number, longestStreak: number): void {
    this.trackEvent({
      category: 'Streak',
      action: 'Update',
      value: currentStreak,
      properties: {
        currentStreak,
        longestStreak
      }
    });
  }

  trackBreathingPattern(patternId: string, cycles: number): void {
    this.trackEvent({
      category: 'Breathing',
      action: 'Pattern',
      label: patternId,
      value: cycles,
      properties: {
        patternId,
        cycles
      }
    });
  }

  trackSettingsChange(setting: string, value: any): void {
    this.trackEvent({
      category: 'Settings',
      action: 'Change',
      label: setting,
      properties: {
        setting,
        value
      }
    });
  }

  trackError(error: Error, context?: string): void {
    this.trackEvent({
      category: 'Error',
      action: 'Occurred',
      label: error.message,
      properties: {
        error: error.message,
        stack: error.stack,
        context
      }
    });
  }

  trackPageView(path: string): void {
    this.trackEvent({
      category: 'Page',
      action: 'View',
      label: path,
      properties: {
        path
      }
    });
  }

  trackFeatureUsage(feature: string): void {
    this.trackEvent({
      category: 'Feature',
      action: 'Use',
      label: feature,
      properties: {
        feature
      }
    });
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getUserProperties(): UserProperties {
    return { ...this.userProperties };
  }

  clearEvents(): void {
    this.events = [];
    logger.info('Analytics events cleared');
  }
}

export const analyticsManager = AnalyticsManager.getInstance(); 