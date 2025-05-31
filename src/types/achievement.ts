import type { Session } from './session';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (sessions: Session[], streakData: StreakData) => boolean;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AchievementProgress {
  [achievementId: string]: {
    unlocked: boolean;
    unlockedAt?: string;
  };
} 