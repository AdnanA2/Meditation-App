import React from 'react';
import { formatTime } from '../../utils/formatTime';
import { Badge } from '../ui/Badge';

interface TimerDisplayProps {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  progress: number;
}

/**
 * Displays the current timer state with time, status, and progress
 */
export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  isRunning,
  isPaused,
  progress,
}) => {
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
    <div className="relative mb-10">
      {/* Timer Display */}
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

      {/* Progress Bar */}
      <div 
        className="w-full h-3 bg-gray-200/60 dark:bg-gray-700/60 rounded-full mb-6 overflow-hidden backdrop-blur-sm shadow-inner"
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
    </div>
  );
}; 