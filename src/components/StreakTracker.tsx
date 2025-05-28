import { useState, useEffect } from 'react'
import { getStreakData, formatStreakDate } from '../utils/streakStorage'

const StreakTracker = () => {
  const [streakData, setStreakData] = useState(getStreakData())

  useEffect(() => {
    // Update streak data when component mounts
    setStreakData(getStreakData())
  }, [])

  if (streakData.streakCount === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600 dark:text-gray-400">
          Start your first session today to begin a streak! 🔥
        </p>
      </div>
    )
  }

  return (
    <div className="text-center py-4">
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🔥</span>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {streakData.streakCount}-Day Streak!
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Last session: {formatStreakDate(streakData.lastCompletedDate)}
        </p>
      </div>
    </div>
  )
}

export default StreakTracker 