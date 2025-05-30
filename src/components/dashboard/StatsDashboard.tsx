import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  getTotalMeditationTime,
  getWeeklyMeditationTime,
  getMonthlyMeditationTime,
  getAverageSessionLength,
  getLongestSession,
  getDailySessionData,
  getWeeklySessionData,
  getSessions
} from '../../utils/sessionStorage';
import { getStreakData } from '../../utils/streakStorage';

type ChartType = 'daily' | 'weekly';

export const StatsDashboard = () => {
  const [chartType, setChartType] = useState<ChartType>('daily');
  const [stats, setStats] = useState({
    totalTime: 0,
    weeklyTime: 0,
    monthlyTime: 0,
    averageSession: 0,
    longestSession: 0,
    totalSessions: 0,
    currentStreak: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const loadStats = () => {
      const sessions = getSessions();
      const streakData = getStreakData();
      
      setStats({
        totalTime: getTotalMeditationTime(),
        weeklyTime: getWeeklyMeditationTime(),
        monthlyTime: getMonthlyMeditationTime(),
        averageSession: getAverageSessionLength(),
        longestSession: getLongestSession(),
        totalSessions: sessions.length,
        currentStreak: streakData.currentStreak
      });

      // Load chart data based on current chart type
      if (chartType === 'daily') {
        setChartData(getDailySessionData(7));
      } else {
        setChartData(getWeeklySessionData(4));
      }
    };

    loadStats();
  }, [chartType]);

  const formatMinutes = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const StatCard = ({ title, value, subtitle, icon }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
  }) => (
    <div className="bg-gradient-to-br from-white/80 to-indigo-50/80 dark:from-gray-700/80 dark:to-indigo-900/20 backdrop-blur-sm rounded-xl p-6 border border-gray-200/30 dark:border-gray-600/30 transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-light text-gray-900 dark:text-white mt-2 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-light">{subtitle}</p>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center">
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200/30 dark:border-gray-600/30">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-light">
            {`${payload[0].value} minutes`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (stats.totalSessions === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
            <span className="text-8xl mb-6 block">📊</span>
            <h2 className="text-3xl font-light mb-4 text-gray-800 dark:text-white">No Data Yet</h2>
            <p className="text-lg font-light opacity-75">Complete some meditation sessions to see your analytics here</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-light text-gray-900 dark:text-white mb-4 tracking-tight">
          📊 Analytics Dashboard
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
          Track your meditation progress and insights
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Time"
          value={formatMinutes(stats.totalTime)}
          icon="⏱️"
        />
        <StatCard
          title="This Week"
          value={formatMinutes(stats.weeklyTime)}
          icon="📅"
        />
        <StatCard
          title="Current Streak"
          value={`${stats.currentStreak} days`}
          icon="🔥"
        />
        <StatCard
          title="Total Sessions"
          value={stats.totalSessions}
          icon="🧘‍♂️"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="This Month"
          value={formatMinutes(stats.monthlyTime)}
          icon="📊"
        />
        <StatCard
          title="Average Session"
          value={formatMinutes(stats.averageSession)}
          icon="⚖️"
        />
        <StatCard
          title="Longest Session"
          value={formatMinutes(stats.longestSession)}
          subtitle="Your personal best"
          icon="🏆"
        />
      </div>

      {/* Chart Section */}
      <Card className="max-w-none">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-4 sm:mb-0">
              Session History
            </h3>
            <div className="flex space-x-3">
              <Button
                variant={chartType === 'daily' ? 'primary' : 'secondary'}
                onClick={() => setChartType('daily')}
                className="text-sm"
              >
                Daily
              </Button>
              <Button
                variant={chartType === 'weekly' ? 'primary' : 'secondary'}
                onClick={() => setChartType('weekly')}
                className="text-sm"
              >
                Weekly
              </Button>
            </div>
          </div>

          <div className="h-80 w-full bg-gradient-to-br from-white/50 to-indigo-50/50 dark:from-gray-800/50 dark:to-indigo-900/20 rounded-xl p-6 border border-gray-200/30 dark:border-gray-600/30">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'daily' ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-gray-600 dark:fill-gray-400"
                  />
                  <YAxis 
                    className="text-xs fill-gray-600 dark:fill-gray-400"
                    label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="duration" 
                    fill="url(#barGradient)"
                    radius={[6, 6, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="week" 
                    className="text-xs fill-gray-600 dark:fill-gray-400"
                  />
                  <YAxis 
                    className="text-xs fill-gray-600 dark:fill-gray-400"
                    label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="duration" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 font-light bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4">
          Keep up the great work! Consistency is key to building a strong meditation practice. 🌟
        </div>
      </Card>
    </div>
  );
}; 