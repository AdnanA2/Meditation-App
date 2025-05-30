export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (sessions: any[], streakData: any) => boolean;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AchievementProgress {
  [achievementId: string]: {
    unlocked: boolean;
    unlockedAt?: string;
  };
} 