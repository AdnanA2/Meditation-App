import { useState, useEffect, useCallback, useRef } from 'react';
import { saveSession } from '../utils/sessionStorage';
import { updateStreak } from '../utils/streakStorage';
import { checkAndUnlockAchievements } from '../utils/achievementStorage';
import type { Achievement } from '../types/achievement';

export type TimerPreset = 5 | 10 | 15 | 20 | 30;

/**
 * Configuration options for the useTimer hook
 */
interface UseTimerProps {
  /** Callback function called when a meditation session completes */
  onSessionComplete: () => void;
  /** Default session duration in seconds (default: 300) */
  defaultSessionDurationSeconds?: number;
  /** Sound file to play when session completes (default: 'bell.mp3') */
  soundFile?: string;
}

/**
 * Return type for the useTimer hook
 */
interface UseTimerReturn {
  /** Current time remaining in seconds */
  timeLeft: number;
  /** Whether the timer is currently running */
  isRunning: boolean;
  /** Whether the timer is paused */
  isPaused: boolean;
  /** Progress percentage (0-100) */
  progress: number;
  /** Array of newly unlocked achievements */
  newlyUnlockedAchievements: Achievement[];
  /** Start or resume the timer */
  startTimer: () => void;
  /** Pause the timer */
  pauseTimer: () => void;
  /** Reset the timer to initial state */
  resetTimer: () => void;
  /** Set timer duration using preset values */
  setDuration: (duration: TimerPreset) => void;
  /** Handle preset button clicks */
  handlePreset: (minutes: TimerPreset) => void;
  /** Clear the newly unlocked achievements array */
  clearNewAchievements: () => void;
}

/**
 * A comprehensive timer hook for meditation sessions with achievement tracking.
 * Manages timer state, audio playback, session storage, and achievement unlocking.
 * 
 * @example
 * ```tsx
 * const {
 *   timeLeft,
 *   isRunning,
 *   startTimer,
 *   pauseTimer,
 *   resetTimer
 * } = useTimer({
 *   onSessionComplete: () => console.log('Session complete!'),
 *   defaultSessionDurationSeconds: 600,
 *   soundFile: 'bell.mp3'
 * });
 * ```
 */
export const useTimer = ({ 
  onSessionComplete, 
  defaultSessionDurationSeconds = 300,
  soundFile = 'bell.mp3'
}: UseTimerProps): UseTimerReturn => {
  const [timeLeft, setTimeLeft] = useState<number>(defaultSessionDurationSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeTimerTotalSeconds, setActiveTimerTotalSeconds] = useState<number>(defaultSessionDurationSeconds);
  const [progress, setProgress] = useState<number>(100);
  const [selectedSessionDurationSeconds, setSelectedSessionDurationSeconds] = useState(defaultSessionDurationSeconds);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<Achievement[]>([]);

  // Initialize audio element when sound file changes
  useEffect(() => {
    try {
      audioRef.current = new Audio(`/${soundFile}`);
      // Preload the audio for better performance
      audioRef.current.preload = 'auto';
    } catch (error) {
      console.warn('Failed to load audio file:', soundFile, error);
    }
  }, [soundFile]);

  // Main timer countdown effect
  useEffect(() => {
    let intervalId: number | undefined;

    if (isRunning && timeLeft > 0) {
      intervalId = window.setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress((newTime / activeTimerTotalSeconds) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Session completed
      handleSessionComplete();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, timeLeft, activeTimerTotalSeconds, selectedSessionDurationSeconds, onSessionComplete]);

  /**
   * Handles session completion logic including audio, storage, and achievements
   */
  const handleSessionComplete = useCallback(async () => {
    try {
      // Play completion sound
      if (audioRef.current) {
        await audioRef.current.play().catch(error => {
          console.warn('Failed to play completion sound:', error);
        });
      }

      // Save session data
      saveSession({
        duration: selectedSessionDurationSeconds,
        timestamp: new Date().toISOString()
      });

      // Update streak
      updateStreak();
      
      // Check for new achievements
      const newAchievements = checkAndUnlockAchievements();
      if (newAchievements.length > 0) {
        setNewlyUnlockedAchievements(newAchievements);
        console.log('🎉 New achievements unlocked:', newAchievements.map(a => a.title));
      }
      
      // Call completion callback
      onSessionComplete();
      
      // Stop timer
      setIsRunning(false);
    } catch (error) {
      console.error('Error handling session completion:', error);
      // Still stop the timer even if there's an error
      setIsRunning(false);
    }
  }, [selectedSessionDurationSeconds, onSessionComplete]);

  /**
   * Start or resume the timer
   */
  const startTimer = useCallback(() => {
    if (timeLeft === 0) {
      setTimeLeft(activeTimerTotalSeconds);
      setProgress(100);
    }
    setIsRunning(true);
    setIsPaused(false);
  }, [activeTimerTotalSeconds, timeLeft]);

  /**
   * Pause the timer
   */
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
  }, []);

  /**
   * Reset the timer to initial state
   */
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(activeTimerTotalSeconds);
    setProgress(100);
  }, [activeTimerTotalSeconds]);

  /**
   * Set timer duration using preset values
   */
  const handleSetDuration = useCallback((newDuration: TimerPreset) => {
    const newDurationInSeconds = newDuration * 60;
    setActiveTimerTotalSeconds(newDurationInSeconds);
    setSelectedSessionDurationSeconds(newDurationInSeconds);
    setTimeLeft(newDurationInSeconds);
    setProgress(100);
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  /**
   * Handle preset button clicks (alias for setDuration)
   */
  const handlePreset = useCallback((minutes: TimerPreset) => {
    const seconds = minutes * 60;
    setActiveTimerTotalSeconds(seconds);
    setSelectedSessionDurationSeconds(seconds);
    setTimeLeft(seconds);
    setProgress(100);
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  /**
   * Clear the newly unlocked achievements array
   */
  const clearNewAchievements = useCallback(() => {
    setNewlyUnlockedAchievements([]);
  }, []);

  return {
    timeLeft,
    isRunning,
    isPaused,
    progress,
    newlyUnlockedAchievements,
    startTimer,
    pauseTimer,
    resetTimer,
    setDuration: handleSetDuration,
    handlePreset,
    clearNewAchievements,
  };
}; 