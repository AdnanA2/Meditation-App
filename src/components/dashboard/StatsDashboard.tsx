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
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">
            {`${payload[0].value} minutes`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (stats.totalSessions === 0) {
    return (
      <Card className="max-w-4xl">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <span className="text-6xl mb-4 block">📊</span>
          <h2 className="text-2xl font-bold mb-2">No Data Yet</h2>
          <p>Complete some meditation sessions to see your analytics here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          📈 Analytics Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your meditation progress and insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
      </div>

      <div className="mb-8">
        <StatCard
          title="Longest Session"
          value={formatMinutes(stats.longestSession)}
          subtitle="Your personal best"
          icon="🏆"
        />
      </div>

      {/* Chart Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Session History
          </h3>
          <div className="flex space-x-2">
            <Button
              variant={chartType === 'daily' ? 'primary' : 'secondary'}
              onClick={() => setChartType('daily')}
              className="text-sm px-3 py-1"
            >
              Daily
            </Button>
            <Button
              variant={chartType === 'weekly' ? 'primary' : 'secondary'}
              onClick={() => setChartType('weekly')}
              className="text-sm px-3 py-1"
            >
              Weekly
            </Button>
          </div>
        </div>

        <div className="h-64 w-full">
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
                  fill="#4f46e5" 
                  radius={[4, 4, 0, 0]}
                />
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
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Keep up the great work! Consistency is key to building a strong meditation practice.
      </div>
    </Card>
  );
}; 