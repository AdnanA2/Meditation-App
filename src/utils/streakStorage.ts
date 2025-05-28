interface StreakData {
  streakCount: number
  lastCompletedDate: string
}

const STREAK_KEY = 'meditationStreak'

export const getStreakData = (): StreakData => {
  const data = localStorage.getItem(STREAK_KEY)
  return data ? JSON.parse(data) : { streakCount: 0, lastCompletedDate: '' }
}

export const updateStreak = (): StreakData => {
  const currentDate = new Date().toDateString()
  const { streakCount, lastCompletedDate } = getStreakData()
  
  // If no previous sessions
  if (!lastCompletedDate) {
    const newData = { streakCount: 1, lastCompletedDate: currentDate }
    localStorage.setItem(STREAK_KEY, JSON.stringify(newData))
    return newData
  }

  const lastDate = new Date(lastCompletedDate)
  const today = new Date(currentDate)
  const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

  let newStreakCount = streakCount

  if (diffDays === 1) {
    // Consecutive day
    newStreakCount = streakCount + 1
  } else if (diffDays > 1) {
    // Streak broken
    newStreakCount = 1
  }
  // If diffDays === 0, it's the same day, keep the streak count

  const newData = {
    streakCount: newStreakCount,
    lastCompletedDate: currentDate
  }
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(newData))
  return newData
}

export const formatStreakDate = (dateString: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
} 