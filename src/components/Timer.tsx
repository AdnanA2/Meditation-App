import React, { useState, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import type { TimerPreset } from '../hooks/useTimer';
import { formatTime } from '../utils/formatTime';
import BreathingPrompt from './BreathingPrompt';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import type { UserPreferences } from '../hooks/useSettings';
import type { Achievement } from '../types/achievement';

interface TimerProps {
  onSessionComplete: () => void;
  preferences: UserPreferences;
  onNewAchievements?: (achievements: Achievement[]) => void;
}

export const Timer: React.FC<TimerProps> = ({ 
  onSessionComplete, 
  preferences,
  onNewAchievements
}) => {
  const {
    timeLeft,
    isRunning,
    isPaused,
    progress,
    newlyUnlockedAchievements,
    startTimer,
    pauseTimer,
    resetTimer,
    handlePreset,
    clearNewAchievements,
  } = useTimer({ 
    onSessionComplete, 
    defaultSessionDurationSeconds: preferences.defaultDuration, 
    soundFile: preferences.sound 
  });

  const presets: TimerPreset[] = [5, 10, 15, 20, 30];
  const [showBreathing, setShowBreathing] = useState(preferences.breathingEnabled);

  useEffect(() => {
    setShowBreathing(preferences.breathingEnabled);
  }, [preferences.breathingEnabled]);

  useEffect(() => {
    if (onNewAchievements && newlyUnlockedAchievements.length > 0) {
      onNewAchievements(newlyUnlockedAchievements);
      clearNewAchievements();
    }
  }, [newlyUnlockedAchievements, onNewAchievements, clearNewAchievements]);

  return (
    <Card>
      {/* Timer Display */}
      <div className="relative mb-10">
        <div 
          className="text-6xl sm:text-7xl font-light text-center text-gray-800 dark:text-white mb-6 transition-all duration-300 tracking-tight"
          role="timer"
          aria-label={`Time remaining: ${formatTime(timeLeft)}`}
        >
          {formatTime(timeLeft)}
        </div>
        {isPaused && (
          <div 
            className="absolute -top-2 right-0 text-xs text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-600/50"
            role="status"
            aria-label="Timer is paused"
          >
            Paused
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div 
        className="w-full h-2 bg-gray-200/60 dark:bg-gray-700/60 rounded-full mb-10 overflow-hidden backdrop-blur-sm"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-linear shadow-sm"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Preset Buttons */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {presets.map((preset) => (
          <Button
            key={preset}
            onClick={() => handlePreset(preset)}
            variant={timeLeft === preset * 60 ? 'primary' : 'secondary'}
            aria-pressed={timeLeft === preset * 60}
            className="text-sm min-w-[3rem]"
          >
            {preset}m
          </Button>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {!isRunning ? (
          <Button 
            onClick={startTimer} 
            variant="primary"
            className="px-8"
            aria-label="Start timer"
          >
            Start
          </Button>
        ) : (
          <Button 
            onClick={pauseTimer} 
            variant="secondary"
            className="px-8"
            aria-label="Pause timer"
          >
            Pause
          </Button>
        )}
        <Button 
          onClick={resetTimer} 
          variant="secondary"
          aria-label="Reset timer"
        >
          Reset
        </Button>
      </div>

      <BreathingPrompt isActive={showBreathing && isRunning && !isPaused} />

      <div className="mt-8 flex justify-center">
        <Button
          onClick={() => setShowBreathing(!showBreathing)}
          variant={showBreathing ? 'primary' : 'secondary'}
          className="text-sm"
          aria-expanded={showBreathing}
          aria-controls="breathing-prompt"
        >
          {showBreathing ? 'Hide Breathing Guide' : 'Show Breathing Guide'}
        </Button>
      </div>
    </Card>
  );
};

export default Timer; 