/**
 * Centralized logging system for the meditation app
 * Provides structured logging with different levels and contexts
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logHistory: LogEntry[] = [];
  private readonly maxHistorySize = 1000;
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: any, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error
    };
  }

  private log(level: LogLevel, message: string, data?: any, error?: Error) {
    const entry = this.formatMessage(level, message, data, error);
    
    // Add to history
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }

    // Console output in development
    if (this.isDevelopment) {
      const consoleMethod = level === 'debug' ? 'debug' : level;
      const args = [message];
      if (data) args.push(data);
      if (error) args.push(error);
      console[consoleMethod](...args);
    }

    // TODO: In production, you might want to send logs to a service
    // like Sentry, LogRocket, or your own logging service
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error, data?: any) {
    this.log('error', message, data, error);
  }

  getLogHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  clearHistory() {
    this.logHistory = [];
  }

  // Specific logging methods for common app events
  sessionComplete(duration: number, achievements?: string[]): void {
    this.info('Meditation session completed', {
      component: 'Timer',
      action: 'session_complete',
      duration,
      achievements,
    });
  }

  achievementUnlocked(achievementId: string, title: string): void {
    this.info('Achievement unlocked', {
      component: 'Achievement',
      action: 'unlock',
      achievementId,
      title,
    });
  }

  settingsSaved(preferences: Record<string, any>): void {
    this.info('Settings saved', {
      component: 'Settings',
      action: 'save',
      preferences,
    });
  }

  storageError(operation: string, key: string, error: Error): void {
    this.error(`Storage operation failed: ${operation}`, error, {
      component: 'Storage',
      action: operation,
      key,
    });
  }

  audioError(operation: string, file: string, error: Error): void {
    this.warn(`Audio operation failed: ${operation}`, {
      component: 'Audio',
      action: operation,
      file,
      error: error.message,
    });
  }
}

export const logger = Logger.getInstance();

// Export convenience functions
export const logSessionComplete = logger.sessionComplete.bind(logger);
export const logAchievementUnlocked = logger.achievementUnlocked.bind(logger);
export const logSettingsSaved = logger.settingsSaved.bind(logger);
export const logStorageError = logger.storageError.bind(logger);
export const logAudioError = logger.audioError.bind(logger); 