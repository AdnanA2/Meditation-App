import { useState, useEffect } from 'react'
import { getStreakData } from '../utils/streakStorage'
import { formatDate } from '../utils/formatDate'
import { IconWrapper } from './ui/IconWrapper'
import { Badge } from './ui/Badge'

/**
 * A component that displays the user's current meditation streak and related information.
 * Updates automatically to handle day changes and provides motivational messaging.
 * 
 * @example
 * ```tsx
 * <StreakTracker />
 * ```
 */
export const StreakTracker = () => {
  const [streakData, setStreakData] = useState(getStreakData())

  useEffect(() => {
    // Update streak data every minute to handle day changes
    const interval = setInterval(() => {
      setStreakData(getStreakData())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  /**
   * Gets the appropriate emoji based on streak length
   */
  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🔥'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '✨'
    if (streak >= 3) return '🌟'
    return '💫'
  }

  /**
   * Gets motivational message based on streak length
   */
  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return 'Incredible dedication! You\'re a meditation master!'
    if (streak >= 14) return 'Two weeks strong! Your consistency is inspiring!'
    if (streak >= 7) return 'Amazing streak! Keep up the great work!'
    if (streak >= 3) return 'You\'re building a great habit!'
    return 'Great start! Keep going!'
  }

  /**
   * Gets the appropriate badge variant based on streak length
   */
  const getBadgeVariant = (streak: number): 'warning' | 'success' | 'primary' => {
    if (streak >= 7) return 'warning' // Gold-like for fire streaks
    if (streak >= 3) return 'success'
    return 'primary'
  }

  /**
   * Gets the appropriate icon variant based on streak length
   */
  const getIconVariant = (streak: number): 'warning' | 'success' | 'primary' => {
    if (streak >= 7) return 'warning'
    if (streak >= 3) return 'success'
    return 'primary'
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-white/90 to-indigo-50/90 dark:from-gray-800/90 dark:to-indigo-900/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-700/30 transition-all duration-300 hover:shadow-2xl">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <IconWrapper
            variant={getIconVariant(streakData.currentStreak)}
            size="xl"
            className="animate-pulse"
            aria-label={`Streak icon: ${getStreakEmoji(streakData.currentStreak)}`}
          >
            {getStreakEmoji(streakData.currentStreak)}
          </IconWrapper>
          
          <div>
            <h2 
              className="text-3xl font-light text-gray-800 dark:text-white tracking-tight"
              aria-label={`Current streak: ${streakData.currentStreak} days`}
            >
              {streakData.currentStreak}
            </h2>
            <Badge 
              variant={getBadgeVariant(streakData.currentStreak)}
              size="md"
              className="uppercase tracking-wider font-medium"
            >
              Day{streakData.currentStreak !== 1 ? 's' : ''} Streak
            </Badge>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 font-light">
          {streakData.lastSessionDate ? (
            <>
              Last session: <time dateTime={streakData.lastSessionDate}>{formatDate(streakData.lastSessionDate)}</time>
            </>
          ) : (
            'Start your meditation journey today!'
          )}
        </p>

        {streakData.currentStreak > 0 && (
          <div 
            className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200/30 dark:border-indigo-700/30"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
              {getStreakMessage(streakData.currentStreak)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 