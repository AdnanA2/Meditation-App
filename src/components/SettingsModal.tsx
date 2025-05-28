import { useState, useEffect } from 'react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (preferences: UserPreferences) => void
}

export interface UserPreferences {
  defaultDuration: number
  breathingEnabled: boolean
  sound: string
}

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultDuration: 600,
  breathingEnabled: true,
  sound: 'bell.mp3'
}

const SOUND_OPTIONS = [
  { value: 'bell.mp3', label: 'Classic Bell' },
  { value: 'bell-2.mp3', label: 'Soft Bell' },
  { value: 'bell-3.mp3', label: 'Zen Bell' }
]

const DURATION_OPTIONS = [
  { value: 300, label: '5 minutes' },
  { value: 600, label: '10 minutes' },
  { value: 900, label: '15 minutes' },
  { value: 1200, label: '20 minutes' }
]

const SettingsModal = ({ isOpen, onClose, onSave }: SettingsModalProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences')
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES
  })

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('userPreferences')
      if (saved) {
        setPreferences(JSON.parse(saved))
      }
    }
  }, [isOpen])

  const handleSave = () => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences))
    onSave(preferences)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Settings
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Session Duration
            </label>
            <select
              value={preferences.defaultDuration}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                defaultDuration: Number(e.target.value)
              }))}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              {DURATION_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bell Sound
            </label>
            <select
              value={preferences.sound}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                sound: e.target.value
              }))}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              {SOUND_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="breathingEnabled"
              checked={preferences.breathingEnabled}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                breathingEnabled: e.target.checked
              }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="breathingEnabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Breathing Guide by Default
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal 