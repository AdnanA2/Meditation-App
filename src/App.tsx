import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import Timer from './components/Timer'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b dark:border-gray-800">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          Meditation Timer
        </h1>
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
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <Timer defaultDuration={300} />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-800">
        <p>Find your peace, one breath at a time</p>
      </footer>
    </div>
  )
}

export default App 