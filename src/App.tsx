import { useState } from 'react';
import Header from './components/Header';
import Timer from './components/Timer';
import SessionHistory from './components/SessionHistory';
import StreakTracker from './components/StreakTracker';
import SettingsModal from './components/SettingsModal';
import { useSettings } from './hooks/useSettings';

function App() {
  const { preferences, updatePreferences } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header onSettingsClick={handleSettingsOpen} />
      <main className="mt-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <StreakTracker />
        <Timer 
          onSessionComplete={handleSessionComplete} 
          preferences={preferences}
        />
        <SessionHistory />
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