import { logger } from './logger';
import { audioManager } from './audio';

export interface UserSettings {
  soundEnabled: boolean;
  soundVolume: number;
  darkMode: boolean;
  notificationsEnabled: boolean;
  reminderTime?: string; // HH:mm format
  defaultSessionDuration: number; // in minutes
  defaultBreathingPattern: string;
  hapticFeedback: boolean;
  autoPlay: boolean;
  language: string;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  animationSpeed: 'slow' | 'normal' | 'fast';
}

const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  soundVolume: 0.7,
  darkMode: false,
  notificationsEnabled: true,
  defaultSessionDuration: 10,
  defaultBreathingPattern: 'box',
  hapticFeedback: true,
  autoPlay: false,
  language: 'en',
  theme: 'system',
  fontSize: 'medium',
  animationSpeed: 'normal'
};

class SettingsManager {
  private static instance: SettingsManager;
  private settings: UserSettings;
  private listeners: Set<(settings: UserSettings) => void> = new Set();

  private constructor() {
    this.settings = this.loadSettings();
  }

  static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  private loadSettings(): UserSettings {
    try {
      const savedSettings = localStorage.getItem('user_settings');
      if (savedSettings) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      logger.error('Failed to load settings', error as Error);
    }
    return { ...DEFAULT_SETTINGS };
  }

  private saveSettings() {
    try {
      localStorage.setItem('user_settings', JSON.stringify(this.settings));
      this.notifyListeners();
      logger.info('Settings saved', this.settings);
    } catch (error) {
      logger.error('Failed to save settings', error as Error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.settings));
  }

  getSettings(): UserSettings {
    return { ...this.settings };
  }

  updateSettings(updates: Partial<UserSettings>) {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();

    // Apply immediate changes
    if (updates.soundEnabled !== undefined) {
      audioManager.setMuted(!updates.soundEnabled);
    }

    if (updates.soundVolume !== undefined) {
      // Update audio volume
      // This would be implemented in the audio manager
    }

    if (updates.darkMode !== undefined) {
      document.documentElement.classList.toggle('dark', updates.darkMode);
    }

    if (updates.theme !== undefined) {
      this.applyTheme(updates.theme);
    }

    if (updates.fontSize !== undefined) {
      this.applyFontSize(updates.fontSize);
    }

    if (updates.animationSpeed !== undefined) {
      this.applyAnimationSpeed(updates.animationSpeed);
    }
  }

  private applyTheme(theme: UserSettings['theme']) {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }

  private applyFontSize(size: UserSettings['fontSize']) {
    const root = document.documentElement;
    root.classList.remove('text-small', 'text-medium', 'text-large');
    root.classList.add(`text-${size}`);
  }

  private applyAnimationSpeed(speed: UserSettings['animationSpeed']) {
    const root = document.documentElement;
    root.classList.remove('animation-slow', 'animation-normal', 'animation-fast');
    root.classList.add(`animation-${speed}`);
  }

  resetSettings() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
    logger.info('Settings reset to defaults');
  }

  addChangeListener(listener: (settings: UserSettings) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Convenience methods for common settings
  isSoundEnabled(): boolean {
    return this.settings.soundEnabled;
  }

  getSoundVolume(): number {
    return this.settings.soundVolume;
  }

  isDarkMode(): boolean {
    return this.settings.darkMode;
  }

  areNotificationsEnabled(): boolean {
    return this.settings.notificationsEnabled;
  }

  getReminderTime(): string | undefined {
    return this.settings.reminderTime;
  }

  getDefaultSessionDuration(): number {
    return this.settings.defaultSessionDuration;
  }

  getDefaultBreathingPattern(): string {
    return this.settings.defaultBreathingPattern;
  }

  isHapticFeedbackEnabled(): boolean {
    return this.settings.hapticFeedback;
  }

  isAutoPlayEnabled(): boolean {
    return this.settings.autoPlay;
  }

  getLanguage(): string {
    return this.settings.language;
  }

  getTheme(): UserSettings['theme'] {
    return this.settings.theme;
  }

  getFontSize(): UserSettings['fontSize'] {
    return this.settings.fontSize;
  }

  getAnimationSpeed(): UserSettings['animationSpeed'] {
    return this.settings.animationSpeed;
  }
}

export const settingsManager = SettingsManager.getInstance(); 