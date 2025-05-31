import { logger } from './logger';
import { settingsManager } from './settings';

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

class HapticsManager {
  private static instance: HapticsManager;
  private navigator: Navigator | null = null;
  private isSupported: boolean = false;

  private constructor() {
    this.initialize();
  }

  static getInstance(): HapticsManager {
    if (!HapticsManager.instance) {
      HapticsManager.instance = new HapticsManager();
    }
    return HapticsManager.instance;
  }

  private initialize() {
    // Check if running in a browser environment
    if (typeof window !== 'undefined') {
      this.navigator = window.navigator;
      this.isSupported = 'vibrate' in this.navigator;
      logger.info('Haptics support status', { isSupported: this.isSupported });
    }
  }

  private getPattern(pattern: HapticPattern): number[] {
    switch (pattern) {
      case 'light':
        return [10];
      case 'medium':
        return [20];
      case 'heavy':
        return [40];
      case 'success':
        return [20, 50, 20];
      case 'warning':
        return [30, 50, 30];
      case 'error':
        return [40, 50, 40, 50, 40];
      default:
        return [20];
    }
  }

  trigger(pattern: HapticPattern): void {
    if (!this.isSupported || !settingsManager.isHapticFeedbackEnabled()) {
      return;
    }

    try {
      const vibrationPattern = this.getPattern(pattern);
      this.navigator?.vibrate(vibrationPattern);
      logger.debug('Haptic feedback triggered', { pattern });
    } catch (error) {
      logger.error('Failed to trigger haptic feedback', error as Error);
    }
  }

  // Convenience methods for common interactions
  triggerButtonPress(): void {
    this.trigger('light');
  }

  triggerSuccess(): void {
    this.trigger('success');
  }

  triggerWarning(): void {
    this.trigger('warning');
  }

  triggerError(): void {
    this.trigger('error');
  }

  triggerBreathingPhase(phase: 'inhale' | 'hold' | 'exhale'): void {
    switch (phase) {
      case 'inhale':
        this.trigger('light');
        break;
      case 'hold':
        this.trigger('medium');
        break;
      case 'exhale':
        this.trigger('heavy');
        break;
    }
  }

  triggerAchievementUnlocked(): void {
    this.trigger('success');
  }

  triggerSessionComplete(): void {
    this.trigger('success');
  }

  triggerSessionStart(): void {
    this.trigger('medium');
  }

  triggerSessionPause(): void {
    this.trigger('light');
  }

  triggerSessionResume(): void {
    this.trigger('light');
  }

  triggerSessionCancel(): void {
    this.trigger('warning');
  }

  triggerStreakMilestone(): void {
    this.trigger('success');
  }

  triggerDailyReminder(): void {
    this.trigger('medium');
  }

  isHapticsSupported(): boolean {
    return this.isSupported;
  }
}

export const hapticsManager = HapticsManager.getInstance(); 