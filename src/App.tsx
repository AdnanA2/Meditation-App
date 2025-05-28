import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import Timer from './components/Timer'
import SessionHistory from './components/SessionHistory'
import StreakTracker from './components/StreakTracker'
import SettingsModal, { UserPreferences } from './components/SettingsModal'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const [sessionKey, setSessionKey] = useState(0)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences')
    return saved ? JSON.parse(saved) : {
      defaultDuration: 600,
      breathingEnabled: true,
      sound: 'bell.mp3'
    }
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const handleSessionComplete = () => {
    setSessionKey(prev => prev + 1)
  }

  const handleSavePreferences = (preferences: UserPreferences) => {
    setUserPreferences(preferences)
    localStorage.setItem('userPreferences', JSON.stringify(preferences))
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b dark:border-gray-800">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          Meditation Timer
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Settings"
          >
            <Cog6ToothIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunIcon className="w-6 h-6" />
            ) : (
              <MoonIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <StreakTracker key={sessionKey} />
          <Timer 
            defaultDuration={userPreferences.defaultDuration} 
            onSessionComplete={handleSessionComplete}
            showBreathingByDefault={userPreferences.breathingEnabled}
            soundFile={userPreferences.sound}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <SessionHistory key={sessionKey} />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-800">
        <p>Find your peace, one breath at a time</p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSavePreferences}
      />
    </div>
  )
}

export default App 