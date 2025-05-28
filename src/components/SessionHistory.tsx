import { useState, useEffect } from 'react'
import { getSessions, clearSessions, formatDuration, formatDate, MeditationSession } from '../utils/sessionStorage'

const SessionHistory = () => {
  const [sessions, setSessions] = useState<MeditationSession[]>([])

  useEffect(() => {
    setSessions(getSessions())
  }, [])

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your meditation history?')) {
      clearSessions()
      setSessions([])
    }
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        No meditation sessions yet. Start your journey today!
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Recent Sessions
        </h2>
        <button
          onClick={handleClearHistory}
          className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
        >
          Clear History
        </button>
      </div>
      
      <div className="space-y-3">
        {sessions.slice(0, 10).map((session, index) => (
          <div
            key={session.timestamp}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex justify-between items-center"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">🧘‍♂️</span>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {formatDuration(session.duration)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(session.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SessionHistory 