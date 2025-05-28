import { useState, useEffect } from 'react'
import { Session } from '../types/session'
import { getSessions, clearSessions } from '../utils/sessionStorage'
import { formatDate } from '../utils/formatDate'

export const SessionHistory = () => {
  const [sessions, setSessions] = useState<Session[]>([])

  const loadSessions = () => {
    setSessions(getSessions())
  }

  useEffect(() => {
    loadSessions()
  }, [])

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your meditation history?')) {
      clearSessions()
      loadSessions()
    }
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }

  if (sessions.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="text-xl mb-2">No meditation sessions yet</p>
          <p className="text-sm">Complete a meditation session to see your history here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Recent Sessions
        </h2>
        <button
          onClick={handleClearHistory}
          className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-4">
        {sessions.map((session, index) => (
          <div
            key={session.timestamp}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🧘</span>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {formatDuration(session.duration)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(session.timestamp)}
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              #{sessions.length - index}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 