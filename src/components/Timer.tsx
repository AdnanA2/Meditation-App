import React, { useState, useEffect } from 'react';
import { useTimer, TimerPreset } from '../hooks/useTimer';
import { formatTime } from '../utils/formatTime';
import BreathingPrompt from './BreathingPrompt';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { UserPreferences } from '../hooks/useSettings';

interface TimerProps {
  onSessionComplete: () => void;
  preferences: UserPreferences;
}

export const Timer: React.FC<TimerProps> = ({ 
  onSessionComplete, 
  preferences
}) => {
  const {
    timeLeft,
    isRunning,
    isPaused,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    handlePreset,
  } = useTimer({ 
    onSessionComplete, 
    defaultDuration: preferences.defaultDuration, 
    soundFile: preferences.sound 
  });

  const presets: TimerPreset[] = [5, 10, 15, 20, 30];
  const [showBreathing, setShowBreathing] = useState(preferences.breathingEnabled);

  // Update breathing guide when preferences change
  useEffect(() => {
    setShowBreathing(preferences.breathingEnabled);
  }, [preferences.breathingEnabled]);

  return (
    <Card>
      {/* Timer Display */}
      <div className="relative mb-8">
        <div 
          className="text-7xl font-bold text-center text-gray-800 dark:text-white mb-4 transition-all duration-300"
          role="timer"
          aria-label={`Time remaining: ${formatTime(timeLeft)}`}
        >
          {formatTime(timeLeft)}
        </div>
        {isPaused && (
          <div 
            className="absolute top-0 right-0 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full"
            role="status"
            aria-label="Timer is paused"
          >
            Paused
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div 
        className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-8 overflow-hidden"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Preset Buttons */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {presets.map((preset) => (
          <Button
            key={preset}
            onClick={() => handlePreset(preset)}
            variant={timeLeft === preset * 60 ? 'primary' : 'secondary'}
            aria-pressed={timeLeft === preset * 60}
            className="transition-all duration-200 hover:scale-105"
          >
            {preset}m
          </Button>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <Button 
            onClick={startTimer} 
            variant="primary"
            className="transition-all duration-200 hover:scale-105"
            aria-label="Start timer"
          >
            Start
          </Button>
        ) : (
          <Button 
            onClick={pauseTimer} 
            variant="secondary"
            className="transition-all duration-200 hover:scale-105"
            aria-label="Pause timer"
          >
            Pause
          </Button>
        )}
        <Button 
          onClick={resetTimer} 
          variant="secondary"
          className="transition-all duration-200 hover:scale-105"
          aria-label="Reset timer"
        >
          Reset
        </Button>
      </div>

      <BreathingPrompt isActive={showBreathing && isRunning && !isPaused} />

      <div className="mt-6 flex justify-center">
        <Button
          onClick={() => setShowBreathing(!showBreathing)}
          variant={showBreathing ? 'primary' : 'secondary'}
          className="transition-all duration-200 hover:scale-105"
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