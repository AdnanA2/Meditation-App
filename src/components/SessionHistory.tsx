import { useState, useEffect } from 'react'
import type { Session } from '../types/session'
import { getRecentSessions, clearSessions } from '../utils/sessionStorage'
import { formatDate } from '../utils/formatDate'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { IconWrapper } from './ui/IconWrapper'
import { Badge } from './ui/Badge'

/**
 * A component that displays the user's recent meditation sessions with options to clear history.
 * Shows session duration, date, and provides visual feedback for loading states.
 * 
 * @example
 * ```tsx
 * <SessionHistory />
 * ```
 */
export const SessionHistory = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClearing, setIsClearing] = useState(false)

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

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your meditation history? This action cannot be undone.')) {
      setIsClearing(true)
      try {
        clearSessions()
        // Add a small delay for better UX
        setTimeout(() => {
          loadSessions()
          setIsClearing(false)
        }, 300)
      } catch (error) {
        console.error('Error clearing sessions:', error)
        setIsClearing(false)
      }
    }
  }

  /**
   * Formats session duration from seconds to human-readable string
   */
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }

  /**
   * Gets session icon based on index for visual variety
   */
  const getSessionIcon = (index: number): string => {
    const icons = ['🧘', '🕐', '🎵', '🌸', '🌿', '💫']
    return icons[index % icons.length]
  }

  /**
   * Gets icon variant based on session duration for visual feedback
   */
  const getSessionIconVariant = (duration: number): 'primary' | 'success' | 'warning' => {
    const minutes = Math.floor(duration / 60)
    if (minutes >= 20) return 'warning' // Gold for longer sessions
    if (minutes >= 10) return 'success'
    return 'primary'
  }

  if (isLoading) {
    return (
      <Card className="max-w-none p-8" aria-label="Loading meditation sessions">
        <div className="flex items-center justify-center py-12 animate-fade-in">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-indigo-200 border-t-indigo-600" aria-hidden="true"></div>
          <span className="ml-4 text-gray-600 dark:text-gray-400 font-light text-lg">Loading sessions...</span>
        </div>
      </Card>
    )
  }

  if (sessions.length === 0) {
    return (
      <Card className="max-w-none p-8" aria-label="No meditation sessions found">
        <div className="text-center text-gray-600 dark:text-gray-400 py-12">
          <IconWrapper variant="info" size="xl" className="mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
            🧘‍♀️
          </IconWrapper>
          <h3 className="text-2xl mb-3 font-light text-gray-800 dark:text-white">No meditation sessions yet</h3>
          <p className="text-base opacity-75">Complete a meditation session to see your history here</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="max-w-none p-8" aria-label="Meditation session history">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-light text-gray-800 dark:text-white tracking-tight">
          Recent Sessions
        </h2>
        <Button 
          onClick={handleClearHistory} 
          variant="danger" 
          size="sm"
          loading={isClearing}
          disabled={isClearing}
          className="px-4 py-2"
          aria-label="Clear all meditation history"
        >
          Clear History
        </Button>
      </div>

      <div className="space-y-4" role="list" aria-label="List of recent meditation sessions">
        {sessions.map((session, index) => (
          <div
            key={session.timestamp}
            className="flex items-center justify-between p-6 bg-gradient-to-r from-white/60 to-indigo-50/60 dark:from-gray-700/60 dark:to-indigo-900/20 backdrop-blur-sm rounded-xl border border-gray-200/30 dark:border-gray-600/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            role="listitem"
          >
            <div className="flex items-center space-x-5">
              <IconWrapper
                variant={getSessionIconVariant(session.duration)}
                size="md"
                className="transform hover:scale-110 transition-transform duration-300"
                aria-label={`Session ${sessions.length - index} icon`}
              >
                {getSessionIcon(index)}
              </IconWrapper>
              
              <div>
                <p className="text-lg font-medium text-gray-800 dark:text-white">
                  {formatDuration(session.duration)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                  <time dateTime={session.timestamp}>
                    {formatDate(session.timestamp)}
                  </time>
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <Badge 
                variant="default" 
                size="sm"
                className="px-3 py-1"
                aria-label={`Session number ${sessions.length - index}`}
              >
                #{sessions.length - index}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
} 