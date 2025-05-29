import { useState } from 'react'
import { SunIcon, MoonIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl space-y-8 mt-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
          <StreakTracker key={sessionKey} />
          <Timer 
            defaultDuration={userPreferences.defaultDuration} 
            onSessionComplete={handleSessionComplete}
            showBreathingByDefault={userPreferences.breathingEnabled}
            soundFile={userPreferences.sound}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
          <SessionHistory key={sessionKey} />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-800 bg-white dark:bg-gray-800 transition-colors duration-300">
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