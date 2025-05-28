import { useState, useEffect, useCallback } from 'react';

export type TimerPreset = 5 | 10 | 15;

interface UseTimerProps {
  onSessionComplete: () => void;
  defaultDuration?: TimerPreset;
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
}

export const useTimer = ({ 
  onSessionComplete, 
  defaultDuration = 5 
}: UseTimerProps): UseTimerReturn => {
  const [timeLeft, setTimeLeft] = useState<number>(defaultDuration * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(defaultDuration * 60);
  const [progress, setProgress] = useState<number>(100);

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
    } else if (timeLeft === 0) {
      setIsRunning(false);
      onSessionComplete();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, timeLeft, duration, onSessionComplete]);

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

  return {
    timeLeft,
    isRunning,
    isPaused,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    setDuration: handleSetDuration,
  };
}; 