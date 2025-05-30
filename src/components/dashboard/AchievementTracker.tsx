import React, { useState, useEffect } from 'react';
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
        relative p-6 rounded-2xl border transition-all duration-500 hover:scale-105
        ${achievement.unlocked
          ? 'bg-gradient-to-br from-yellow-50/90 to-orange-50/90 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-300/50 dark:border-yellow-600/50 shadow-lg hover:shadow-xl'
          : 'bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-800/80 border-gray-200/50 dark:border-gray-600/50 opacity-70 hover:opacity-90'
        }
        ${showAnimation ? 'animate-pulse ring-4 ring-yellow-300/50 dark:ring-yellow-600/50' : ''}
      `}
    >
      {showAnimation && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full animate-bounce shadow-lg">
          NEW! ✨
        </div>
      )}
      
      <div className="flex items-start space-x-4">
        <div className={`text-4xl transition-all duration-300 ${achievement.unlocked ? 'scale-110' : 'grayscale opacity-50'}`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold text-lg mb-2 ${achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {achievement.title}
          </h3>
          <p className={`text-sm leading-relaxed ${achievement.unlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
            {achievement.description}
          </p>
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-3 font-medium bg-yellow-100/50 dark:bg-yellow-900/20 px-2 py-1 rounded-full inline-block">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        {achievement.unlocked && (
          <div className="text-yellow-500 bg-yellow-100/50 dark:bg-yellow-900/30 p-2 rounded-full">
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-light text-gray-900 dark:text-white mb-4 tracking-tight">
          🏆 Goals & Achievements
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
          Track your meditation milestones and celebrate your progress
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="max-w-none">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-light text-gray-900 dark:text-white">
              Progress Overview
            </h3>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium">
              <span>{stats.unlocked} of {stats.total} achievements unlocked</span>
              <span className="text-lg font-light">{stats.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200/60 dark:bg-gray-700/60 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-3 text-3xl">✨</span>
            Unlocked Achievements ({unlockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-3 text-3xl">🎯</span>
            Goals to Achieve ({lockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <Card>
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
            <span className="text-8xl mb-6 block">🎯</span>
            <h3 className="text-3xl font-light mb-4 text-gray-800 dark:text-white">Start Your Journey</h3>
            <p className="text-lg font-light opacity-75">Complete your first meditation session to begin unlocking achievements!</p>
          </div>
        </Card>
      )}
    </div>
  );
}; 