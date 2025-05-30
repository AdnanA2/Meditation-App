import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (preferences: UserPreferences) => void
  initialPreferences: UserPreferences
}

export interface UserPreferences {
  defaultDuration: number
  breathingEnabled: boolean
  sound: string
}

const SOUND_OPTIONS = [
  { value: 'bell.mp3', label: 'Classic Bell' },
  { value: 'rain.mp3', label: 'Rain Sounds' },
  { value: 'beach.mp3', label: 'Beach Waves' }
]

const DURATION_OPTIONS = [
  { value: 300, label: '5 minutes' },
  { value: 600, label: '10 minutes' },
  { value: 900, label: '15 minutes' },
  { value: 1200, label: '20 minutes' },
  { value: 1800, label: '30 minutes' }
]

const SettingsModal = ({ isOpen, onClose, onSave, initialPreferences }: SettingsModalProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences)
  const modalRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    setPreferences(initialPreferences)
  }, [initialPreferences, isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Focus the first focusable element
      setTimeout(() => {
        firstFocusableRef.current?.focus()
      }, 100)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleSave = () => {
    onSave(preferences)
    onClose()
  }

  const handleCancel = () => {
    setPreferences(initialPreferences)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <Card 
        className="w-full max-w-md animate-fade-in"
        ref={modalRef}
      >
        <h2 
          id="settings-title"
          className="text-2xl font-bold text-gray-800 dark:text-white mb-6"
        >
          Settings
        </h2>

        <div className="space-y-6">
          <div>
            <label 
              htmlFor="duration-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Default Duration
            </label>
            <select
              id="duration-select"
              ref={firstFocusableRef}
              value={preferences.defaultDuration}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                defaultDuration: Number(e.target.value)
              }))}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {DURATION_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label 
              htmlFor="sound-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Completion Sound
            </label>
            <select
              id="sound-select"
              value={preferences.sound}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                sound: e.target.value
              }))}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded focus:ring-2"
            />
            <label htmlFor="breathingEnabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Breathing Guide by Default
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <Button onClick={handleCancel} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="primary">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default SettingsModal 