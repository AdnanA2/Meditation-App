import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import type { UserPreferences } from '../hooks/useSettings'

/**
 * Props for the SettingsModal component
 */
interface SettingsModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean
  /** Callback function called when the modal should be closed */
  onClose: () => void
  /** Callback function called when settings are saved */
  onSave: (preferences: UserPreferences) => void
  /** Initial preferences to populate the form */
  initialPreferences: UserPreferences
}

/**
 * Available sound options for meditation completion
 */
const SOUND_OPTIONS = [
  { value: 'bell.mp3', label: 'Classic Bell' },
  { value: 'rain.mp3', label: 'Rain Sounds' },
  { value: 'beach.mp3', label: 'Beach Waves' }
] as const

/**
 * Available duration options in seconds
 */
const DURATION_OPTIONS = [
  { value: 300, label: '5 minutes' },
  { value: 600, label: '10 minutes' },
  { value: 900, label: '15 minutes' },
  { value: 1200, label: '20 minutes' },
  { value: 1800, label: '30 minutes' }
] as const

/**
 * A modal component for configuring user meditation preferences.
 * Provides form controls for duration, sound, and breathing guide settings.
 * Includes proper accessibility features and keyboard navigation.
 * 
 * @example
 * ```tsx
 * <SettingsModal
 *   isOpen={showSettings}
 *   onClose={() => setShowSettings(false)}
 *   onSave={handleSaveSettings}
 *   initialPreferences={userPreferences}
 * />
 * ```
 */
const SettingsModal = ({ isOpen, onClose, onSave, initialPreferences }: SettingsModalProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences)
  const [isSaving, setIsSaving] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLSelectElement>(null)

  // Update local state when initial preferences change
  useEffect(() => {
    setPreferences(initialPreferences)
  }, [initialPreferences, isOpen])

  // Handle escape key and focus management
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      
      // Focus the first focusable element
      setTimeout(() => {
        firstFocusableRef.current?.focus()
      }, 100)
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  /**
   * Handle clicking outside the modal to close it
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  /**
   * Handle saving preferences with validation
   */
  const handleSave = async () => {
    setIsSaving(true)
    try {
      onSave(preferences)
      onClose()
    } catch (error) {
      console.error('Error saving preferences:', error)
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Handle canceling changes and reverting to initial state
   */
  const handleCancel = () => {
    setPreferences(initialPreferences)
    onClose()
  }

  /**
   * Update a specific preference field
   */
  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      aria-describedby="settings-description"
    >
      <Card 
        className="w-full max-w-md animate-scale-in"
        ref={modalRef}
        role="document"
      >
        <header className="mb-6">
          <h2 
            id="settings-title"
            className="text-2xl font-light text-gray-800 dark:text-white tracking-tight"
          >
            ⚙️ Settings
          </h2>
          <p 
            id="settings-description"
            className="text-sm text-gray-600 dark:text-gray-400 mt-2"
          >
            Customize your meditation experience
          </p>
        </header>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-6">
            {/* Duration Setting */}
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
                onChange={(e) => updatePreference('defaultDuration', Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              >
                {DURATION_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sound Setting */}
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
                onChange={(e) => updatePreference('sound', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              >
                {SOUND_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Breathing Guide Setting */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="breathingEnabled"
                checked={preferences.breathingEnabled}
                onChange={(e) => updatePreference('breathingEnabled', e.target.checked)}
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded focus:ring-2 transition-colors"
              />
              <div>
                <label 
                  htmlFor="breathingEnabled" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Enable Breathing Guide by Default
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Show visual breathing prompts during meditation sessions
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-3">
            <Button 
              type="button"
              onClick={handleCancel} 
              variant="secondary"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="primary"
              loading={isSaving}
              disabled={isSaving}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default SettingsModal 