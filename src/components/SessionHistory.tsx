import { useState, useEffect } from 'react'
import type { Session } from '../types/session'
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

  const getSessionIcon = (index: number): string => {
    const icons = ['🧘', '🕐', '🎵', '🌸', '🌿', '💫']
    return icons[index % icons.length]
  }

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12 animate-fade-in">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-200 border-t-indigo-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400 font-light">Loading sessions...</span>
        </div>
      </Card>
    )
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <div className="text-center text-gray-600 dark:text-gray-400 py-8">
          <div className="text-6xl mb-4">🧘‍♀️</div>
          <p className="text-xl mb-2 font-light">No meditation sessions yet</p>
          <p className="text-sm opacity-75">Complete a meditation session to see your history here</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-light text-gray-800 dark:text-white tracking-tight">
          Recent Sessions
        </h2>
        <Button onClick={handleClearHistory} variant="danger" className="text-sm">
          Clear History
        </Button>
      </div>

      <div className="space-y-3">
        {sessions.map((session, index) => (
          <div
            key={session.timestamp}
            className="flex items-center justify-between p-5 bg-gradient-to-r from-white/60 to-indigo-50/60 dark:from-gray-700/60 dark:to-indigo-900/20 backdrop-blur-sm rounded-xl border border-gray-200/30 dark:border-gray-600/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center">
                <span className="text-xl">{getSessionIcon(index)}</span>
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {formatDuration(session.duration)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                  {formatDate(session.timestamp)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100/80 dark:bg-gray-700/80 px-2 py-1 rounded-full">
                #{sessions.length - index}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
} 