import React from 'react';
import { Button } from '../ui/Button';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  timeLeft: number;
  defaultDuration: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

/**
 * Timer control buttons for start, pause, and reset functionality
 */
export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  timeLeft,
  defaultDuration,
  onStart,
  onPause,
  onReset,
}) => {
  const isResetDisabled = !isRunning && !isPaused && timeLeft === defaultDuration;

  return (
    <div className="flex justify-center gap-4 mb-8">
      {!isRunning ? (
        <Button 
          onClick={onStart} 
          variant="primary"
          size="lg"
          className="px-8"
          aria-label="Start meditation timer"
        >
          {isPaused ? 'Resume' : 'Start'}
        </Button>
      ) : (
        <Button 
          onClick={onPause} 
          variant="secondary"
          size="lg"
          className="px-8"
          aria-label="Pause meditation timer"
        >
          Pause
        </Button>
      )}
      
      <Button 
        onClick={onReset} 
        variant="secondary"
        size="lg"
        aria-label="Reset meditation timer"
        disabled={isResetDisabled}
      >
        Reset
      </Button>
    </div>
  );
}; 