import type { Session } from '../types/session';

const STORAGE_KEY = 'meditation_sessions';

export const saveSession = (session: Session): void => {
  const sessions = getSessions();
  sessions.unshift(session); // Add new session at the beginning
  // Remove the limit to keep all sessions for analytics
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export const getSessions = (): Session[] => {
  const sessions = localStorage.getItem(STORAGE_KEY);
  return sessions ? JSON.parse(sessions) : [];
};

export const getRecentSessions = (limit: number = 10): Session[] => {
  const sessions = getSessions();
  return sessions.slice(0, limit);
};

export const clearSessions = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  return `${minutes} min`
}

export const formatDate = (timestamp: string): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Analytics helper functions
export const getTotalMeditationTime = (): number => {
  const sessions = getSessions();
  return sessions.reduce((total, session) => total + session.duration, 0);
};

export const getWeeklyMeditationTime = (): number => {
  const sessions = getSessions();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return sessions
    .filter(session => new Date(session.timestamp) >= oneWeekAgo)
    .reduce((total, session) => total + session.duration, 0);
};

export const getMonthlyMeditationTime = (): number => {
  const sessions = getSessions();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  return sessions
    .filter(session => new Date(session.timestamp) >= oneMonthAgo)
    .reduce((total, session) => total + session.duration, 0);
};

export const getAverageSessionLength = (): number => {
  const sessions = getSessions();
  if (sessions.length === 0) return 0;
  
  const total = sessions.reduce((sum, session) => sum + session.duration, 0);
  return Math.round(total / sessions.length);
};

export const getLongestSession = (): number => {
  const sessions = getSessions();
  if (sessions.length === 0) return 0;
  
  return Math.max(...sessions.map(session => session.duration));
};

export const getDailySessionData = (days: number = 7): Array<{date: string, duration: number}> => {
  const sessions = getSessions();
  const result: Array<{date: string, duration: number}> = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTotal = sessions
      .filter(session => session.timestamp.split('T')[0] === dateStr)
      .reduce((total, session) => total + session.duration, 0);
    
    result.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      duration: Math.round(dayTotal / 60) // Convert to minutes
    });
  }
  
  return result;
};

export const getWeeklySessionData = (weeks: number = 4): Array<{week: string, duration: number}> => {
  const sessions = getSessions();
  const result: Array<{week: string, duration: number}> = [];
  
  for (let i = weeks - 1; i >= 0; i--) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - (i * 7));
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);
    
    const weekTotal = sessions
      .filter(session => {
        const sessionDate = new Date(session.timestamp);
        return sessionDate >= startDate && sessionDate <= endDate;
      })
      .reduce((total, session) => total + session.duration, 0);
    
    result.push({
      week: `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      duration: Math.round(weekTotal / 60) // Convert to minutes
    });
  }
  
  return result;
}; 