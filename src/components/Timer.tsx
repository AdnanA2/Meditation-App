import { useTimer, TimerPreset } from '../hooks/useTimer';
import { formatTime } from '../utils/formatTime';
import { useState } from 'react';
import BreathingPrompt from './BreathingPrompt';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface TimerProps {
  onSessionComplete: () => void;
  defaultDuration?: TimerPreset;
  showBreathingByDefault?: boolean;
  soundFile?: string;
}

export const Timer = ({ 
  onSessionComplete, 
  defaultDuration = 5, 
  showBreathingByDefault = false, 
  soundFile = 'bell.mp3' 
}: TimerProps) => {
  const {
    timeLeft,
    isRunning,
    isPaused,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    handlePreset,
  } = useTimer({ onSessionComplete, defaultDuration, soundFile });

  const presets: TimerPreset[] = [5, 10, 15];
  const [showBreathing, setShowBreathing] = useState(showBreathingByDefault);

  return (
    <Card>
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
          className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Preset Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {presets.map((preset) => (
          <Button
            key={preset}
            onClick={() => handlePreset(preset)}
            variant={timeLeft === preset * 60 ? 'primary' : 'secondary'}
          >
            {preset}m
          </Button>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <Button onClick={startTimer} variant="primary">
            Start
          </Button>
        ) : (
          <Button onClick={pauseTimer} variant="secondary">
            Pause
          </Button>
        )}
        <Button onClick={resetTimer} variant="secondary">
          Reset
        </Button>
      </div>

      <BreathingPrompt isActive={showBreathing && !isPaused} />

      <div className="mt-4 flex justify-center">
        <Button
          onClick={() => setShowBreathing(!showBreathing)}
          variant={showBreathing ? 'primary' : 'secondary'}
        >
          {showBreathing ? 'Hide Breathing Guide' : 'Show Breathing Guide'}
        </Button>
      </div>
    </Card>
  );
};

export default Timer; 