import { Session } from '../types/session';

const STORAGE_KEY = 'meditation_sessions';

export const saveSession = (session: Session): void => {
  const sessions = getSessions();
  sessions.unshift(session); // Add new session at the beginning
  // Keep only the last 10 sessions
  const trimmedSessions = sessions.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedSessions));
};

export const getSessions = (): Session[] => {
  const sessions = localStorage.getItem(STORAGE_KEY);
  return sessions ? JSON.parse(sessions) : [];
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