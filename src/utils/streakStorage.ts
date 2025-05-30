const STREAK_KEY = 'meditation_streak';

interface StreakData {
  currentStreak: number;
  lastSessionDate: string;
}

export const getStreakData = (): StreakData => {
  const streakData = localStorage.getItem(STREAK_KEY);
  return streakData ? JSON.parse(streakData) : { currentStreak: 0, lastSessionDate: '' };
};

export const updateStreak = (): void => {
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
  }
  
  const streakData: StreakData = {
    currentStreak: newStreak,
    lastSessionDate: today
  };
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
};

export const resetStreak = (): void => {
  localStorage.removeItem(STREAK_KEY);
};

export const formatStreakDate = (dateString: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
} 