// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react';
import { Header } from './components/Header';
import Timer from './components/Timer';
import { SessionHistory } from './components/SessionHistory';
import { StreakTracker } from './components/StreakTracker';
import SettingsModal from './components/SettingsModal';
import { StatsDashboard } from './components/dashboard/StatsDashboard';
import { AchievementTracker } from './components/dashboard/AchievementTracker';
import { Navigation } from './components/Navigation';
import type { NavigationTab } from './components/Navigation';
import { useSettings } from './hooks/useSettings';

function App() {
  const { preferences, updatePreferences } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('timer');

  const handleSessionComplete = () => {
    // This will be called when a meditation session is completed
    // The Timer component will handle updating the session history internally
    console.log('Meditation session completed');
  };

  const handleSettingsOpen = () => {
    setIsSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
  };

  const handleSettingsSave = (newPreferences: typeof preferences) => {
    updatePreferences(newPreferences);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'timer':
        return (
          <>
            <StreakTracker />
            <Timer 
              onSessionComplete={handleSessionComplete} 
              preferences={preferences}
            />
            <SessionHistory />
          </>
        );
      case 'analytics':
        return <StatsDashboard />;
      case 'achievements':
        return <AchievementTracker />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header onSettingsClick={handleSettingsOpen} />
      <main className="mt-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        {renderActiveTab()}
      </main>
      
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        onSave={handleSettingsSave}
        initialPreferences={preferences}
      />
    </div>
  );
}

export default App; 