import { formatDate } from './formatDate';

const STREAK_KEY = 'meditation_streak';

/**
 * Represents the current meditation streak data
 */
interface StreakData {
  currentStreak: number;
  lastSessionDate: string;
}

/**
 * Gets the current streak data from localStorage
 * @returns Current streak data
 */
export const getStreakData = (): StreakData => {
  try {
    const streakData = localStorage.getItem(STREAK_KEY);
    return streakData ? JSON.parse(streakData) : { currentStreak: 0, lastSessionDate: '' };
  } catch (error) {
    console.error('Failed to retrieve streak data:', error);
    return { currentStreak: 0, lastSessionDate: '' };
  }
};

/**
 * Updates the meditation streak based on the last session date
 * @throws {Error} If localStorage is not available
 */
export const updateStreak = (): void => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { currentStreak, lastSessionDate } = getStreakData();
    const lastDate = lastSessionDate ? new Date(lastSessionDate).toISOString().split('T')[0] : '';
    
    let newStreak = currentStreak;
    
    if (!lastDate) {
      // First session ever
      newStreak = 1;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastDate === yesterdayStr) {
        // Meditated yesterday, increment streak
        newStreak = currentStreak + 1;
      } else if (lastDate !== today) {
        // Missed a day, reset streak
        newStreak = 1;
      }
      // If lastDate === today, keep the same streak
    }
    
    const streakData: StreakData = {
      currentStreak: newStreak,
      lastSessionDate: today
    };
    
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
  } catch (error) {
    console.error('Failed to update streak:', error);
    throw new Error('Failed to update streak in localStorage');
  }
};

/**
 * Resets the meditation streak
 * @throws {Error} If localStorage is not available
 */
export const resetStreak = (): void => {
  try {
    localStorage.removeItem(STREAK_KEY);
  } catch (error) {
    console.error('Failed to reset streak:', error);
    throw new Error('Failed to reset streak in localStorage');
  }
};

/**
 * Formats a streak date for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatStreakDate = (dateString: string): string => {
  if (!dateString) return '';
  return formatDate(dateString, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}; 