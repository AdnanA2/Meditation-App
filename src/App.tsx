import { useState, useEffect } from 'react'
import Timer from './components/Timer'
import SessionHistory from './components/SessionHistory'
import StreakTracker from './components/StreakTracker'
import SettingsModal, { UserPreferences } from './components/SettingsModal'
import { Header } from './components/Header'

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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header />
      
      <main className="mt-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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

      <footer className="mt-8 p-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Find your peace, one breath at a time</p>
      </footer>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSavePreferences}
      />
    </div>
  )
}

export default App 