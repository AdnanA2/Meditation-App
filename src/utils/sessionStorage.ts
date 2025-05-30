import type { Session } from '../types/session';
import { formatDate } from './formatDate';

const STORAGE_KEY = 'meditation_sessions';

/**
 * Saves a meditation session to localStorage
 * @param session - The session to save
 * @throws {Error} If localStorage is not available or session is invalid
 */
export const saveSession = (session: Session): void => {
  if (!session.duration || !session.timestamp) {
    throw new Error('Invalid session data');
  }

  try {
    const sessions = getSessions();
    sessions.unshift(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save session:', error);
    throw new Error('Failed to save session to localStorage');
  }
};

/**
 * Retrieves all meditation sessions from localStorage
 * @returns Array of meditation sessions
 */
export const getSessions = (): Session[] => {
  try {
    const sessions = localStorage.getItem(STORAGE_KEY);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Failed to retrieve sessions:', error);
    return [];
  }
};

/**
 * Retrieves the most recent meditation sessions
 * @param limit - Maximum number of sessions to return
 * @returns Array of recent meditation sessions
 */
export const getRecentSessions = (limit: number = 10): Session[] => {
  const sessions = getSessions();
  return sessions.slice(0, limit);
};

/**
 * Clears all meditation sessions from localStorage
 */
export const clearSessions = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear sessions:', error);
  }
};

/**
 * Formats a duration in seconds to a human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

/**
 * Formats a session timestamp to a human-readable string
 * @param timestamp - ISO timestamp string
 * @returns Formatted date string
 */
export const formatSessionDate = (timestamp: string): string => {
  return formatDate(timestamp, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculates total meditation time across all sessions
 * @returns Total duration in seconds
 */
export const getTotalMeditationTime = (): number => {
  const sessions = getSessions();
  return sessions.reduce((total, session) => total + session.duration, 0);
};

/**
 * Calculates meditation time for the past week
 * @returns Total duration in seconds
 */
export const getWeeklyMeditationTime = (): number => {
  const sessions = getSessions();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return sessions
    .filter(session => new Date(session.timestamp) >= oneWeekAgo)
    .reduce((total, session) => total + session.duration, 0);
};

/**
 * Calculates meditation time for the past month
 * @returns Total duration in seconds
 */
export const getMonthlyMeditationTime = (): number => {
  const sessions = getSessions();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  return sessions
    .filter(session => new Date(session.timestamp) >= oneMonthAgo)
    .reduce((total, session) => total + session.duration, 0);
};

/**
 * Calculates average session length
 * @returns Average duration in seconds
 */
export const getAverageSessionLength = (): number => {
  const sessions = getSessions();
  if (sessions.length === 0) return 0;
  
  const total = sessions.reduce((sum, session) => sum + session.duration, 0);
  return Math.round(total / sessions.length);
};

/**
 * Finds the longest meditation session
 * @returns Duration of longest session in seconds
 */
export const getLongestSession = (): number => {
  const sessions = getSessions();
  if (sessions.length === 0) return 0;
  
  return Math.max(...sessions.map(session => session.duration));
};

/**
 * Gets daily meditation data for the specified number of days
 * @param days - Number of days to include
 * @returns Array of daily meditation data
 */
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
      date: formatDate(date.toISOString(), { month: 'short', day: 'numeric' }),
      duration: Math.round(dayTotal / 60) // Convert to minutes
    });
  }
  
  return result;
};

/**
 * Gets weekly meditation data for the specified number of weeks
 * @param weeks - Number of weeks to include
 * @returns Array of weekly meditation data
 */
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
      week: formatDate(startDate.toISOString(), { month: 'short', day: 'numeric' }),
      duration: Math.round(weekTotal / 60) // Convert to minutes
    });
  }
  
  return result;
}; 