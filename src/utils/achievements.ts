import { logger } from './logger';
import { audioManager } from './audio';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  total?: number;
}

export interface AchievementProgress {
  achievementId: string;
  progress: number;
  total: number;
}

class AchievementManager {
  private static instance: AchievementManager;
  private achievements: Map<string, Achievement> = new Map();
  private unlockedAchievements: Set<string> = new Set();

  private constructor() {
    this.initializeAchievements();
  }

  static getInstance(): AchievementManager {
    if (!AchievementManager.instance) {
      AchievementManager.instance = new AchievementManager();
    }
    return AchievementManager.instance;
  }

  private initializeAchievements() {
    // Meditation streak achievements
    this.addAchievement({
      id: 'first_meditation',
      title: 'First Step',
      description: 'Complete your first meditation session',
      icon: '🌱',
      total: 1
    });

    this.addAchievement({
      id: 'three_day_streak',
      title: 'Getting Started',
      description: 'Meditate for 3 days in a row',
      icon: '🔥',
      total: 3
    });

    this.addAchievement({
      id: 'seven_day_streak',
      title: 'Week Warrior',
      description: 'Meditate for 7 days in a row',
      icon: '🌟',
      total: 7
    });

    this.addAchievement({
      id: 'thirty_day_streak',
      title: 'Mindfulness Master',
      description: 'Meditate for 30 days in a row',
      icon: '👑',
      total: 30
    });

    // Session count achievements
    this.addAchievement({
      id: 'ten_sessions',
      title: 'Dedicated Beginner',
      description: 'Complete 10 meditation sessions',
      icon: '🎯',
      total: 10
    });

    this.addAchievement({
      id: 'fifty_sessions',
      title: 'Consistent Practitioner',
      description: 'Complete 50 meditation sessions',
      icon: '🎖️',
      total: 50
    });

    this.addAchievement({
      id: 'hundred_sessions',
      title: 'Meditation Veteran',
      description: 'Complete 100 meditation sessions',
      icon: '🏆',
      total: 100
    });

    // Duration achievements
    this.addAchievement({
      id: 'hour_total',
      title: 'Hour of Peace',
      description: 'Meditate for a total of 1 hour',
      icon: '⏰',
      total: 3600 // 1 hour in seconds
    });

    this.addAchievement({
      id: 'five_hours_total',
      title: 'Time Well Spent',
      description: 'Meditate for a total of 5 hours',
      icon: '⌛',
      total: 18000 // 5 hours in seconds
    });

    this.addAchievement({
      id: 'ten_hours_total',
      title: 'Mindful Master',
      description: 'Meditate for a total of 10 hours',
      icon: '⏳',
      total: 36000 // 10 hours in seconds
    });
  }

  private addAchievement(achievement: Achievement) {
    this.achievements.set(achievement.id, achievement);
  }

  async updateProgress(progress: AchievementProgress): Promise<Achievement | null> {
    const achievement = this.achievements.get(progress.achievementId);
    
    if (!achievement) {
      logger.warn('Achievement not found', { achievementId: progress.achievementId });
      return null;
    }

    if (this.unlockedAchievements.has(achievement.id)) {
      return null;
    }

    achievement.progress = progress.progress;

    if (progress.progress >= (achievement.total || 0)) {
      await this.unlockAchievement(achievement);
      return achievement;
    }

    return null;
  }

  private async unlockAchievement(achievement: Achievement) {
    achievement.unlockedAt = new Date();
    this.unlockedAchievements.add(achievement.id);
    
    // Play celebration sound
    await audioManager.playSound('/sounds/achievement.mp3', {
      volume: 0.5,
      fadeIn: 200,
      fadeOut: 500
    });

    logger.info('Achievement unlocked', { 
      achievementId: achievement.id,
      title: achievement.title
    });

    // Dispatch achievement unlocked event
    window.dispatchEvent(new CustomEvent('achievementUnlocked', {
      detail: achievement
    }));
  }

  getAchievement(id: string): Achievement | undefined {
    return this.achievements.get(id);
  }

  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  getUnlockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => this.unlockedAchievements.has(a.id));
  }

  getLockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => !this.unlockedAchievements.has(a.id));
  }

  isAchievementUnlocked(id: string): boolean {
    return this.unlockedAchievements.has(id);
  }

  getProgress(id: string): number {
    const achievement = this.achievements.get(id);
    return achievement?.progress || 0;
  }

  getTotal(id: string): number {
    const achievement = this.achievements.get(id);
    return achievement?.total || 0;
  }

  getProgressPercentage(id: string): number {
    const progress = this.getProgress(id);
    const total = this.getTotal(id);
    return total > 0 ? (progress / total) * 100 : 0;
  }
}

export const achievementManager = AchievementManager.getInstance(); 