import { useState, useEffect, useCallback, useRef } from 'react';
import { saveSession } from '../utils/sessionStorage';
import { updateStreak } from '../utils/streakStorage';
import { checkAndUnlockAchievements } from '../utils/achievementStorage';

export type TimerPreset = 5 | 10 | 15 | 20 | 30;

interface UseTimerProps {
  onSessionComplete: () => void;
  defaultDuration?: number;
  soundFile?: string;
}

interface UseTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  progress: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setDuration: (duration: TimerPreset) => void;
  handlePreset: (minutes: TimerPreset) => void;
}

export const useTimer = ({ 
  onSessionComplete, 
  defaultDuration = 300,
  soundFile = 'bell.mp3'
}: UseTimerProps): UseTimerReturn => {
  const [timeLeft, setTimeLeft] = useState<number>(defaultDuration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(defaultDuration);
  const [progress, setProgress] = useState<number>(100);
  const [initialDuration, setInitialDuration] = useState(defaultDuration);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(`/${soundFile}`);
  }, [soundFile]);

  useEffect(() => {
    let intervalId: number | undefined;

    if (isRunning && timeLeft > 0) {
      intervalId = window.setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress((newTime / duration) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      audioRef.current?.play();
      setDuration(initialDuration);
      // Save completed session and update streak
      saveSession({
        duration: initialDuration,
        timestamp: new Date().toISOString()
      });
      updateStreak();
      
      // Check for newly unlocked achievements
      const newAchievements = checkAndUnlockAchievements();
      if (newAchievements.length > 0) {
        // You could emit an event or call a callback here to show notifications
        console.log('🎉 New achievements unlocked:', newAchievements.map(a => a.title));
      }
      
      onSessionComplete();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, timeLeft, duration, initialDuration, onSessionComplete]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(duration);
    setProgress(100);
  }, [duration]);

  const handleSetDuration = useCallback((newDuration: TimerPreset) => {
    const newDurationInSeconds = newDuration * 60;
    setDuration(newDurationInSeconds);
    setTimeLeft(newDurationInSeconds);
    setProgress(100);
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const handlePreset = useCallback((minutes: TimerPreset) => {
    const seconds = minutes * 60;
    setDuration(seconds);
    setInitialDuration(seconds);
    setTimeLeft(seconds);
    setProgress(100);
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  return {
    timeLeft,
    isRunning,
    isPaused,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    setDuration: handleSetDuration,
    handlePreset,
  };
}; 