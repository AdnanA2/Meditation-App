import { useState, useEffect, useRef } from 'react'
import BreathingPrompt from './BreathingPrompt'
import { saveSession } from '../utils/sessionStorage'
import { updateStreak } from '../utils/streakStorage'

interface TimerProps {
  defaultDuration?: number
  onSessionComplete?: () => void
}

const Timer = ({ defaultDuration = 300, onSessionComplete }: TimerProps) => {
  const [seconds, setSeconds] = useState(defaultDuration)
  const [isActive, setIsActive] = useState(false)
  const [showBreathing, setShowBreathing] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/bell.mp3')
  }, [])

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
        duration: defaultDuration,
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
  }, [isActive, seconds, defaultDuration, onSessionComplete])

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