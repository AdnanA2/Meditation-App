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

  const getStreakMessage = (streak: number): string => {
    if (streak >= 7) return 'Amazing streak! Keep up the great work!'
    if (streak >= 3) return 'You\'re building a great habit!'
    return 'Great start! Keep going!'
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-white/90 to-indigo-50/90 dark:from-gray-800/90 dark:to-indigo-900/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-700/30 transition-all duration-300 hover:shadow-2xl">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <span className="text-5xl animate-pulse">{getStreakEmoji(streakData.currentStreak)}</span>
          <div>
            <h2 className="text-3xl font-light text-gray-800 dark:text-white tracking-tight">
              {streakData.currentStreak}
            </h2>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Day{streakData.currentStreak !== 1 ? 's' : ''} Streak
            </p>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 font-light">
          {streakData.lastSessionDate ? (
            <>
              Last session: {formatDate(streakData.lastSessionDate)}
            </>
          ) : (
            'Start your meditation journey today!'
          )}
        </p>

        {streakData.currentStreak > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200/30 dark:border-indigo-700/30">
            <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
              {getStreakMessage(streakData.currentStreak)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 