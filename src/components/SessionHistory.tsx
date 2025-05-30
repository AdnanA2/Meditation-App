import { useState, useEffect } from 'react'
import { Session } from '../types/session'
import { getRecentSessions, clearSessions } from '../utils/sessionStorage'
import { formatDate } from '../utils/formatDate'
import { Card } from './ui/Card'
import { Button } from './ui/Button'

export const SessionHistory = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadSessions = () => {
    setIsLoading(true)
    // Simulate loading delay for better UX
    setTimeout(() => {
      setSessions(getRecentSessions())
      setIsLoading(false)
    }, 500)
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

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8 animate-fade-in">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading sessions...</span>
        </div>
      </Card>
    )
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="text-xl mb-2">No meditation sessions yet</p>
          <p className="text-sm">Complete a meditation session to see your history here</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Recent Sessions
        </h2>
        <Button onClick={handleClearHistory} variant="danger">
          Clear History
        </Button>
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
    </Card>
  )
} 