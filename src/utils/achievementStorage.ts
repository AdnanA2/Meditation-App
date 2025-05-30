import type { Achievement, AchievementProgress } from '../types/achievement';
import { getSessions } from './sessionStorage';
import { getStreakData } from './streakStorage';

const ACHIEVEMENT_KEY = 'meditation_achievements';

/**
 * Validates an achievement object
 * @param achievement - The achievement to validate
 * @throws {Error} If the achievement is invalid
 */
const validateAchievement = (achievement: Achievement): void => {
  if (!achievement.id || !achievement.title || !achievement.description || !achievement.icon || typeof achievement.condition !== 'function') {
    throw new Error(`Invalid achievement: ${achievement.id || 'unknown'}`);
  }
};

/**
 * All available achievements in the app
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_session',
    title: 'First Steps',
    description: 'Complete your first meditation session',
    icon: '🌱',
    condition: (sessions) => sessions.length >= 1,
    unlocked: false
  },
  {
    id: 'streak_3',
    title: '3-Day Streak',
    description: 'Meditate for 3 consecutive days',
    icon: '🔥',
    condition: (_, streakData) => streakData.currentStreak >= 3,
    unlocked: false
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Meditate for 7 consecutive days',
    icon: '⚡',
    condition: (_, streakData) => streakData.currentStreak >= 7,
    unlocked: false
  },
  {
    id: 'streak_30',
    title: 'Month Master',
    description: 'Meditate for 30 consecutive days',
    icon: '👑',
    condition: (_, streakData) => streakData.currentStreak >= 30,
    unlocked: false
  },
  {
    id: 'total_100_minutes',
    title: 'Century Club',
    description: 'Accumulate 100 total minutes of meditation',
    icon: '💯',
    condition: (sessions) => {
      const total = sessions.reduce((sum, session) => sum + session.duration, 0);
      return total >= 6000; // 100 minutes in seconds
    },
    unlocked: false
  },
  {
    id: 'total_1000_minutes',
    title: 'Meditation Master',
    description: 'Accumulate 1000 total minutes of meditation',
    icon: '🧘‍♂️',
    condition: (sessions) => {
      const total = sessions.reduce((sum, session) => sum + session.duration, 0);
      return total >= 60000; // 1000 minutes in seconds
    },
    unlocked: false
  },
  {
    id: 'long_session_30',
    title: 'Deep Dive',
    description: 'Complete a 30-minute meditation session',
    icon: '🌊',
    condition: (sessions) => sessions.some(session => session.duration >= 1800), // 30 minutes
    unlocked: false
  },
  {
    id: 'long_session_60',
    title: 'Hour of Peace',
    description: 'Complete a 60-minute meditation session',
    icon: '🕉️',
    condition: (sessions) => sessions.some(session => session.duration >= 3600), // 60 minutes
    unlocked: false
  },
  {
    id: 'sessions_10',
    title: 'Dedicated Practitioner',
    description: 'Complete 10 meditation sessions',
    icon: '🎯',
    condition: (sessions) => sessions.length >= 10,
    unlocked: false
  },
  {
    id: 'sessions_50',
    title: 'Mindfulness Expert',
    description: 'Complete 50 meditation sessions',
    icon: '🏆',
    condition: (sessions) => sessions.length >= 50,
    unlocked: false
  }
];

// Validate all achievements on load
ACHIEVEMENTS.forEach(validateAchievement);

/**
 * Gets the current achievement progress from localStorage
 * @returns Current achievement progress
 */
export const getAchievementProgress = (): AchievementProgress => {
  try {
    const progress = localStorage.getItem(ACHIEVEMENT_KEY);
    return progress ? JSON.parse(progress) : {};
  } catch (error) {
    console.error('Failed to retrieve achievement progress:', error);
    return {};
  }
};

/**
 * Saves achievement progress to localStorage
 * @param progress - The achievement progress to save
 * @throws {Error} If localStorage is not available
 */
export const saveAchievementProgress = (progress: AchievementProgress): void => {
  try {
    localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save achievement progress:', error);
    throw new Error('Failed to save achievement progress to localStorage');
  }
};

/**
 * Checks and unlocks any newly achieved achievements
 * @returns Array of newly unlocked achievements
 */
export const checkAndUnlockAchievements = (): Achievement[] => {
  try {
    const sessions = getSessions();
    const streakData = getStreakData();
    const progress = getAchievementProgress();
    const newlyUnlocked: Achievement[] = [];

    const updatedProgress = { ...progress };

    ACHIEVEMENTS.forEach(achievement => {
      const isCurrentlyUnlocked = progress[achievement.id]?.unlocked || false;
      
      if (!isCurrentlyUnlocked && achievement.condition(sessions, streakData)) {
        updatedProgress[achievement.id] = {
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
        newlyUnlocked.push({
          ...achievement,
          unlocked: true,
          unlockedAt: updatedProgress[achievement.id].unlockedAt
        });
      }
    });

    if (newlyUnlocked.length > 0) {
      saveAchievementProgress(updatedProgress);
    }

    return newlyUnlocked;
  } catch (error) {
    console.error('Failed to check achievements:', error);
    return [];
  }
};

/**
 * Gets all achievements with their current progress
 * @returns Array of all achievements with progress
 */
export const getAllAchievementsWithProgress = (): Achievement[] => {
  try {
    const progress = getAchievementProgress();
    
    return ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      unlocked: progress[achievement.id]?.unlocked || false,
      unlockedAt: progress[achievement.id]?.unlockedAt
    }));
  } catch (error) {
    console.error('Failed to get achievements with progress:', error);
    return ACHIEVEMENTS;
  }
};

/**
 * Gets all unlocked achievements
 * @returns Array of unlocked achievements
 */
export const getUnlockedAchievements = (): Achievement[] => {
  return getAllAchievementsWithProgress().filter(achievement => achievement.unlocked);
};

/**
 * Gets achievement statistics
 * @returns Object containing achievement stats
 */
export const getAchievementStats = () => {
  try {
    const allAchievements = getAllAchievementsWithProgress();
    const unlockedCount = allAchievements.filter(a => a.unlocked).length;
    
    return {
      total: allAchievements.length,
      unlocked: unlockedCount,
      percentage: Math.round((unlockedCount / allAchievements.length) * 100)
    };
  } catch (error) {
    console.error('Failed to get achievement stats:', error);
    return { total: 0, unlocked: 0, percentage: 0 };
  }
}; 