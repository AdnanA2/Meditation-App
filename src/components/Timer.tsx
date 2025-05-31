import React, { useState, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import type { TimerPreset } from '../hooks/useTimer';
import { formatTime } from '../utils/formatTime';
import BreathingPrompt from './BreathingPrompt';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import type { UserPreferences } from '../hooks/useSettings';
import type { Achievement } from '../types/achievement';

/**
 * Props for the Timer component
 */
interface TimerProps {
  /** Callback function called when a meditation session completes */
  onSessionComplete: () => void;
  /** User preferences for timer configuration */
  preferences: UserPreferences;
  /** Optional callback for handling newly unlocked achievements */
  onNewAchievements?: (achievements: Achievement[]) => void;
}

/**
 * Available timer preset durations in minutes
 */
const TIMER_PRESETS: TimerPreset[] = [5, 10, 15, 20, 30];

/**
 * A comprehensive meditation timer component with preset options, breathing guide,
 * and achievement tracking. Provides visual feedback and accessibility features.
 * 
 * @example
 * ```tsx
 * <Timer
 *   onSessionComplete={() => console.log('Session complete!')}
 *   preferences={userPreferences}
 *   onNewAchievements={handleNewAchievements}
 * />
 * ```
 */
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

  const [showBreathing, setShowBreathing] = useState(preferences.breathingEnabled);

  // Update breathing guide visibility when preferences change
  useEffect(() => {
    setShowBreathing(preferences.breathingEnabled);
  }, [preferences.breathingEnabled]);

  // Handle newly unlocked achievements
  useEffect(() => {
    if (onNewAchievements && newlyUnlockedAchievements.length > 0) {
      onNewAchievements(newlyUnlockedAchievements);
      clearNewAchievements();
    }
  }, [newlyUnlockedAchievements, onNewAchievements, clearNewAchievements]);

  /**
   * Gets the appropriate status message based on timer state
   */
  const getTimerStatus = (): string => {
    if (isPaused) return 'Paused';
    if (isRunning) return 'Meditating';
    return 'Ready to start';
  };

  /**
   * Gets the appropriate badge variant based on timer state
   */
  const getStatusBadgeVariant = (): 'warning' | 'success' | 'default' => {
    if (isPaused) return 'warning';
    if (isRunning) return 'success';
    return 'default';
  };

  /**
   * Formats the current time for screen readers
   */
  const getTimeAnnouncement = (): string => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes} minutes and ${seconds} seconds remaining`;
  };

  return (
    <Card 
      className="max-w-lg"
      aria-label="Meditation timer"
      role="region"
    >
      {/* Timer Display */}
      <div className="relative mb-10">
        <div 
          className="text-6xl sm:text-7xl font-light text-center text-gray-800 dark:text-white mb-6 transition-all duration-300 tracking-tight"
          role="timer"
          aria-label={getTimeAnnouncement()}
          aria-live="polite"
          aria-atomic="true"
        >
          {formatTime(timeLeft)}
        </div>
        
        {/* Status Badge */}
        <div className="flex justify-center mb-4">
          <Badge 
            variant={getStatusBadgeVariant()}
            size="md"
            role="status"
            aria-label={`Timer status: ${getTimerStatus()}`}
          >
            {getTimerStatus()}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="w-full h-3 bg-gray-200/60 dark:bg-gray-700/60 rounded-full mb-10 overflow-hidden backdrop-blur-sm shadow-inner"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Meditation progress: ${Math.round(progress)}% complete`}
      >
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-linear shadow-sm"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Preset Buttons */}
      <div className="mb-10">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4 text-center uppercase tracking-wider">
          Quick Select
        </h3>
        <div className="flex justify-center gap-3 flex-wrap">
          {TIMER_PRESETS.map((preset) => {
            const isSelected = timeLeft === preset * 60;
            return (
              <Button
                key={preset}
                onClick={() => handlePreset(preset)}
                variant={isSelected ? 'primary' : 'secondary'}
                size="sm"
                aria-pressed={isSelected}
                aria-label={`Set timer to ${preset} minutes`}
                className="min-w-[3rem]"
                disabled={isRunning}
              >
                {preset}m
              </Button>
            );
          })}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {!isRunning ? (
          <Button 
            onClick={startTimer} 
            variant="primary"
            size="lg"
            className="px-8"
            aria-label="Start meditation timer"
          >
            {isPaused ? 'Resume' : 'Start'}
          </Button>
        ) : (
          <Button 
            onClick={pauseTimer} 
            variant="secondary"
            size="lg"
            className="px-8"
            aria-label="Pause meditation timer"
          >
            Pause
          </Button>
        )}
        <Button 
          onClick={resetTimer} 
          variant="secondary"
          size="lg"
          aria-label="Reset meditation timer"
          disabled={!isRunning && !isPaused && timeLeft === preferences.defaultDuration}
        >
          Reset
        </Button>
      </div>

      {/* Breathing Prompt */}
      <BreathingPrompt 
        isActive={showBreathing && isRunning && !isPaused}
        cycleDuration={4000}
        countdownDuration={4}
      />

      {/* Breathing Guide Toggle */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={() => setShowBreathing(!showBreathing)}
          variant={showBreathing ? 'primary' : 'secondary'}
          size="sm"
          aria-expanded={showBreathing}
          aria-controls="breathing-prompt"
          aria-label={`${showBreathing ? 'Hide' : 'Show'} breathing guide`}
        >
          {showBreathing ? '🫁 Hide Breathing Guide' : '🫁 Show Breathing Guide'}
        </Button>
      </div>
    </Card>
  );
};

export default Timer; 