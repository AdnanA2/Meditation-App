import { useState, useEffect } from 'react'
import { getStreakData } from '../utils/streakStorage'
import { formatDate } from '../utils/formatDate'

export const StreakTracker = () => {
  const [streakData, setStreakData] = useState(getStreakData())

  useEffect(() => {
    // Update streak data every minute to handle day changes
    const interval = setInterval(() => {
      setStreakData(getStreakData())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌟'
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-4xl">{getStreakEmoji(streakData.currentStreak)}</span>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''}
          </h2>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400">
          {streakData.lastSessionDate ? (
            <>
              Last session: {formatDate(streakData.lastSessionDate)}
            </>
          ) : (
            'Start your meditation journey today!'
          )}
        </p>

        {streakData.currentStreak > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {streakData.currentStreak >= 7
                ? 'Amazing streak! Keep up the great work!'
                : streakData.currentStreak >= 3
                ? 'You\'re building a great habit!'
                : 'Great start! Keep going!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 