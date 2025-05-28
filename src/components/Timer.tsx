import { useTimer, TimerPreset } from '../hooks/useTimer';
import { formatTime } from '../utils/formatTime';
import { useState, useEffect, useRef } from 'react'
import BreathingPrompt from './BreathingPrompt'
import { saveSession } from '../utils/sessionStorage'
import { updateStreak } from '../utils/streakStorage'

interface TimerProps {
  onSessionComplete: () => void;
  defaultDuration?: TimerPreset;
  showBreathingByDefault?: boolean;
  soundFile?: string;
}

export const Timer = ({ onSessionComplete, defaultDuration = 5, showBreathingByDefault = false, soundFile = 'bell.mp3' }: TimerProps) => {
  const {
    timeLeft,
    isRunning,
    isPaused,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    setDuration,
  } = useTimer({ onSessionComplete, defaultDuration });

  const presets: TimerPreset[] = [5, 10, 15];

  const [showBreathing, setShowBreathing] = useState(showBreathingByDefault)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [initialDuration, setInitialDuration] = useState(defaultDuration * 60)

  useEffect(() => {
    audioRef.current = new Audio(`/${soundFile}`)
  }, [soundFile])

  useEffect(() => {
    let interval: number | undefined

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setDuration(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      audioRef.current?.play()
      setDuration(initialDuration)
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
  }, [isRunning, timeLeft, initialDuration, onSessionComplete])

  const handlePreset = (minutes: number) => {
    setDuration(minutes * 60)
    setInitialDuration(minutes * 60)
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {/* Timer Display */}
      <div className="relative mb-8">
        <div className="text-6xl font-bold text-center text-gray-800 dark:text-white mb-4">
          {formatTime(timeLeft)}
        </div>
        {isPaused && (
          <div className="absolute top-0 right-0 text-sm text-gray-500 dark:text-gray-400">
            Paused
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8">
        <div
          className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Preset Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePreset(preset)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeLeft === preset * 60
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {preset}m
          </button>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Pause
          </button>
        )}
        <button
          onClick={resetTimer}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      <BreathingPrompt isActive={showBreathing && !isPaused} />

      <button
        onClick={() => setShowBreathing(!showBreathing)}
        className={`btn ${showBreathing ? 'btn-primary' : 'btn-secondary'}`}
      >
        {showBreathing ? 'Hide Breathing Guide' : 'Show Breathing Guide'}
      </button>
    </div>
  );
};

export default Timer 