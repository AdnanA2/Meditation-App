import { useState, useEffect, useCallback, useRef } from 'react';
import { saveSession } from '../utils/sessionStorage';
import { updateStreak } from '../utils/streakStorage';
import { checkAndUnlockAchievements } from '../utils/achievementStorage';
import type { Achievement } from '../types/achievement';

export type TimerPreset = 5 | 10 | 15 | 20 | 30;

interface UseTimerProps {
  onSessionComplete: () => void;
  defaultSessionDurationSeconds?: number;
  soundFile?: string;
}

interface UseTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  progress: number;
  newlyUnlockedAchievements: Achievement[];
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setDuration: (duration: TimerPreset) => void;
  handlePreset: (minutes: TimerPreset) => void;
  clearNewAchievements: () => void;
}

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

  useEffect(() => {
    audioRef.current = new Audio(`/${soundFile}`);
  }, [soundFile]);

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
      audioRef.current?.play();
      saveSession({
        duration: selectedSessionDurationSeconds,
        timestamp: new Date().toISOString()
      });
      updateStreak();
      
      const newAchievements = checkAndUnlockAchievements();
      if (newAchievements.length > 0) {
        setNewlyUnlockedAchievements(newAchievements);
        console.log('🎉 Internal: New achievements unlocked:', newAchievements.map(a => a.title));
      }
      
      onSessionComplete();
      setIsRunning(false);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeft, activeTimerTotalSeconds, selectedSessionDurationSeconds, onSessionComplete]);

  const startTimer = useCallback(() => {
    if (timeLeft === 0) {
      setTimeLeft(activeTimerTotalSeconds);
      setProgress(100);
    }
    setIsRunning(true);
    setIsPaused(false);
  }, [activeTimerTotalSeconds, timeLeft]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(activeTimerTotalSeconds);
    setProgress(100);
  }, [activeTimerTotalSeconds]);

  const handleSetDuration = useCallback((newDuration: TimerPreset) => {
    const newDurationInSeconds = newDuration * 60;
    setActiveTimerTotalSeconds(newDurationInSeconds);
    setSelectedSessionDurationSeconds(newDurationInSeconds);
    setTimeLeft(newDurationInSeconds);
    setProgress(100);
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const handlePreset = useCallback((minutes: TimerPreset) => {
    const seconds = minutes * 60;
    setActiveTimerTotalSeconds(seconds);
    setSelectedSessionDurationSeconds(seconds);
    setTimeLeft(seconds);
    setProgress(100);
    setIsRunning(false);
    setIsPaused(false);
  }, []);

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