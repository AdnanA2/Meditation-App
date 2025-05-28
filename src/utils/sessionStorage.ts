export interface MeditationSession {
  duration: number
  timestamp: string
}

const STORAGE_KEY = 'meditationSessions'

export const saveSession = (session: MeditationSession): void => {
  const sessions = getSessions()
  sessions.unshift(session) // Add new session at the beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export const getSessions = (): MeditationSession[] => {
  const sessions = localStorage.getItem(STORAGE_KEY)
  return sessions ? JSON.parse(sessions) : []
}

export const clearSessions = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

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