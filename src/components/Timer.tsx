import { useState, useEffect } from 'react'

interface TimerProps {
  defaultDuration?: number
}

const Timer = ({ defaultDuration = 300 }: TimerProps) => {
  const [seconds, setSeconds] = useState(defaultDuration)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: number | undefined

    if (isActive && seconds > 0) {
      interval = window.setInterval(() => {
        setSeconds((seconds) => seconds - 1)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isActive, seconds])

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleStartPause = () => {
    setIsActive(!isActive)
  }

  const handleReset = () => {
    setIsActive(false)
    setSeconds(defaultDuration)
  }

  const handlePreset = (minutes: number) => {
    setIsActive(false)
    setSeconds(minutes * 60)
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-7xl font-bold font-mono">
        {formatTime(seconds)}
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={handleStartPause}
          className="btn btn-primary"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="btn btn-secondary"
        >
          Reset
        </button>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => handlePreset(5)}
          className="btn btn-secondary"
        >
          5 min
        </button>
        <button
          onClick={() => handlePreset(10)}
          className="btn btn-secondary"
        >
          10 min
        </button>
        <button
          onClick={() => handlePreset(15)}
          className="btn btn-secondary"
        >
          15 min
        </button>
      </div>
    </div>
  )
}

export default Timer 