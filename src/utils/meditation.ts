import { logger } from './logger';
import { audioManager } from './audio';
import { achievementManager } from './achievements';

export interface MeditationSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  type: 'breathing' | 'guided' | 'silence';
  completed: boolean;
  notes?: string;
}

export interface MeditationStats {
  totalSessions: number;
  totalDuration: number; // in seconds
  averageDuration: number; // in seconds
  currentStreak: number;
  longestStreak: number;
  lastSessionDate?: Date;
}

class MeditationManager {
  private static instance: MeditationManager;
  private sessions: MeditationSession[] = [];
  private currentSession: MeditationSession | null = null;
  private stats: MeditationStats = {
    totalSessions: 0,
    totalDuration: 0,
    averageDuration: 0,
    currentStreak: 0,
    longestStreak: 0
  };

  private constructor() {
    this.loadSessions();
    this.calculateStats();
  }

  static getInstance(): MeditationManager {
    if (!MeditationManager.instance) {
      MeditationManager.instance = new MeditationManager();
    }
    return MeditationManager.instance;
  }

  private loadSessions() {
    try {
      const savedSessions = localStorage.getItem('meditation_sessions');
      if (savedSessions) {
        this.sessions = JSON.parse(savedSessions).map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined
        }));
      }
    } catch (error) {
      logger.error('Failed to load meditation sessions', error as Error);
    }
  }

  private saveSessions() {
    try {
      localStorage.setItem('meditation_sessions', JSON.stringify(this.sessions));
    } catch (error) {
      logger.error('Failed to save meditation sessions', error as Error);
    }
  }

  private calculateStats() {
    const completedSessions = this.sessions.filter(s => s.completed);
    
    this.stats.totalSessions = completedSessions.length;
    this.stats.totalDuration = completedSessions.reduce((sum, s) => sum + s.duration, 0);
    this.stats.averageDuration = this.stats.totalSessions > 0 
      ? this.stats.totalDuration / this.stats.totalSessions 
      : 0;

    // Calculate streaks
    const sortedSessions = [...completedSessions].sort((a, b) => 
      b.startTime.getTime() - a.startTime.getTime()
    );

    if (sortedSessions.length > 0) {
      this.stats.lastSessionDate = sortedSessions[0].startTime;
      
      let currentStreak = 1;
      let longestStreak = 1;
      let lastDate = new Date(sortedSessions[0].startTime);
      lastDate.setHours(0, 0, 0, 0);

      for (let i = 1; i < sortedSessions.length; i++) {
        const sessionDate = new Date(sortedSessions[i].startTime);
        sessionDate.setHours(0, 0, 0, 0);

        const dayDiff = Math.floor((lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else if (dayDiff > 1) {
          break;
        }

        lastDate = sessionDate;
      }

      this.stats.currentStreak = currentStreak;
      this.stats.longestStreak = longestStreak;
    }
  }

  async startSession(type: MeditationSession['type']): Promise<MeditationSession> {
    if (this.currentSession) {
      throw new Error('A session is already in progress');
    }

    const session: MeditationSession = {
      id: crypto.randomUUID(),
      startTime: new Date(),
      duration: 0,
      type,
      completed: false
    };

    this.currentSession = session;
    this.sessions.push(session);
    this.saveSessions();

    // Play start sound
    await audioManager.playSound('/sounds/meditation-start.mp3', {
      volume: 0.3,
      fadeIn: 200
    });

    logger.info('Meditation session started', { sessionId: session.id, type });

    return session;
  }

  async endSession(notes?: string): Promise<MeditationSession> {
    if (!this.currentSession) {
      throw new Error('No session in progress');
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - this.currentSession.startTime.getTime()) / 1000);

    this.currentSession.endTime = endTime;
    this.currentSession.duration = duration;
    this.currentSession.completed = true;
    this.currentSession.notes = notes;

    const completedSession = this.currentSession;
    this.currentSession = null;

    this.saveSessions();
    this.calculateStats();

    // Update achievements
    await this.updateAchievements(completedSession);

    // Play end sound
    await audioManager.playSound('/sounds/meditation-end.mp3', {
      volume: 0.3,
      fadeIn: 200,
      fadeOut: 500
    });

    logger.info('Meditation session completed', { 
      sessionId: completedSession.id,
      duration,
      type: completedSession.type
    });

    return completedSession;
  }

  private async updateAchievements(session: MeditationSession) {
    if (!session.completed) return;

    // Update session count achievement
    await achievementManager.updateProgress({
      achievementId: 'ten_sessions',
      progress: this.stats.totalSessions,
      total: 10
    });

    // Update duration achievements
    await achievementManager.updateProgress({
      achievementId: 'hour_total',
      progress: this.stats.totalDuration,
      total: 3600
    });

    // Update streak achievements
    await achievementManager.updateProgress({
      achievementId: 'three_day_streak',
      progress: this.stats.currentStreak,
      total: 3
    });

    await achievementManager.updateProgress({
      achievementId: 'seven_day_streak',
      progress: this.stats.currentStreak,
      total: 7
    });

    await achievementManager.updateProgress({
      achievementId: 'thirty_day_streak',
      progress: this.stats.currentStreak,
      total: 30
    });
  }

  getCurrentSession(): MeditationSession | null {
    return this.currentSession;
  }

  getSessions(): MeditationSession[] {
    return [...this.sessions];
  }

  getStats(): MeditationStats {
    return { ...this.stats };
  }

  getSessionsByDateRange(startDate: Date, endDate: Date): MeditationSession[] {
    return this.sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  }

  getSessionsByType(type: MeditationSession['type']): MeditationSession[] {
    return this.sessions.filter(session => session.type === type);
  }

  deleteSession(sessionId: string): void {
    const index = this.sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      this.sessions.splice(index, 1);
      this.saveSessions();
      this.calculateStats();
      logger.info('Meditation session deleted', { sessionId });
    }
  }
}

export const meditationManager = MeditationManager.getInstance(); 