import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import type { Achievement } from '../../types/achievement';
import {
  getAllAchievementsWithProgress,
  getAchievementStats,
  checkAndUnlockAchievements
} from '../../utils/achievementStorage';

interface AchievementCardProps {
  achievement: Achievement;
  isNewlyUnlocked?: boolean;
}

const AchievementCard = ({ achievement, isNewlyUnlocked = false }: AchievementCardProps) => {
  const [showAnimation, setShowAnimation] = useState(isNewlyUnlocked);

  useEffect(() => {
    if (isNewlyUnlocked) {
      const timer = setTimeout(() => setShowAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isNewlyUnlocked]);

  return (
    <div
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-300
        ${achievement.unlocked
          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-600'
          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-60'
        }
        ${showAnimation ? 'animate-pulse ring-4 ring-yellow-300 dark:ring-yellow-600' : ''}
      `}
    >
      {showAnimation && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full animate-bounce">
          NEW!
        </div>
      )}
      
      <div className="flex items-start space-x-3">
        <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale'}`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {achievement.title}
          </h3>
          <p className={`text-sm ${achievement.unlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
            {achievement.description}
          </p>
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        {achievement.unlocked && (
          <div className="text-yellow-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export const AchievementTracker = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState({ total: 0, unlocked: 0, percentage: 0 });
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

  useEffect(() => {
    const loadAchievements = () => {
      // Check for newly unlocked achievements
      const newAchievements = checkAndUnlockAchievements();
      if (newAchievements.length > 0) {
        setNewlyUnlocked(newAchievements.map(a => a.id));
        // Show notification for newly unlocked achievements
        newAchievements.forEach(achievement => {
          // You could add a toast notification here
          console.log(`🎉 Achievement unlocked: ${achievement.title}`);
        });
      }

      // Load all achievements with progress
      const allAchievements = getAllAchievementsWithProgress();
      setAchievements(allAchievements);
      setStats(getAchievementStats());
    };

    loadAchievements();
  }, []);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <Card className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🏆 Goals & Achievements
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your meditation milestones and celebrate your progress
        </p>
      </div>

      {/* Progress Overview */}
      <div className="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Progress Overview
          </h3>
          <span className="text-2xl">📊</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>{stats.unlocked} of {stats.total} achievements</span>
              <span>{stats.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2">✨</span>
            Unlocked Achievements ({unlockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isNewlyUnlocked={newlyUnlocked.includes(achievement.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            Goals to Achieve ({lockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedAchievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
              />
            ))}
          </div>
        </div>
      )}

      {achievements.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-400 py-8">
          <span className="text-6xl mb-4 block">🎯</span>
          <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
          <p>Complete your first meditation session to begin unlocking achievements!</p>
        </div>
      )}
    </Card>
  );
}; 