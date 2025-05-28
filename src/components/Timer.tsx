import { useState, useEffect, useRef } from 'react'
import BreathingPrompt from './BreathingPrompt'
import { saveSession } from '../utils/sessionStorage'
import { updateStreak } from '../utils/streakStorage'

interface TimerProps {
  defaultDuration?: number
  onSessionComplete?: () => void
  showBreathingByDefault?: boolean
  soundFile?: string
}

const Timer = ({ 
  defaultDuration = 300, 
  onSessionComplete,
  showBreathingByDefault = false,
  soundFile = 'bell.mp3'
}: TimerProps) => {
  const [seconds, setSeconds] = useState(defaultDuration)
  const [isActive, setIsActive] = useState(false)
  const [showBreathing, setShowBreathing] = useState(showBreathingByDefault)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [initialDuration, setInitialDuration] = useState(defaultDuration)

  useEffect(() => {
    audioRef.current = new Audio(`/${soundFile}`)
  }, [soundFile])

  useEffect(() => {
    let interval: number | undefined

    if (isActive && seconds > 0) {
      interval = window.setInterval(() => {
        setSeconds((seconds) => seconds - 1)
      }, 1000)
    } else if (seconds === 0 && isActive) {
      audioRef.current?.play()
      setIsActive(false)
      // Save completed session and update streak
      saveSession({
        duration: initialDuration,
        timestamp: new Date().toISOString()
      })
      updateStreak()
      onSessionComplete?.()
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isActive, seconds, initialDuration, onSessionComplete])

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
    setSeconds(initialDuration)
  }

  const handlePreset = (minutes: number) => {
    setIsActive(false)
    const newDuration = minutes * 60
    setInitialDuration(newDuration)
    setSeconds(newDuration)
  }

  const progress = ((initialDuration - seconds) / initialDuration) * 100

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="relative w-full max-w-md">
        <div className="text-7xl font-bold font-mono text-center transition-opacity duration-300"
             style={{ opacity: isActive ? 1 : 0.6 }}>
          {formatTime(seconds)}
        </div>
        {!isActive && seconds < initialDuration && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 text-lg text-gray-500 animate-pulse">
            Paused
          </div>
        )}
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-4 overflow-hidden">
          <div 
            className="h-full bg-primary-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <BreathingPrompt isActive={showBreathing && isActive} />
      
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

      <button
        onClick={() => setShowBreathing(!showBreathing)}
        className={`btn ${showBreathing ? 'btn-primary' : 'btn-secondary'}`}
      >
        {showBreathing ? 'Hide Breathing Guide' : 'Show Breathing Guide'}
      </button>
    </div>
  )
}

export default Timer 