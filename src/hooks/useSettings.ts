import { useState, useEffect, useCallback } from 'react';

/**
 * User preferences configuration interface
 */
export interface UserPreferences {
  /** Default meditation session duration in seconds */
  defaultDuration: number;
  /** Whether breathing guide is enabled by default */
  breathingEnabled: boolean;
  /** Sound file to play when session completes */
  sound: string;
}

/**
 * Default user preferences
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  defaultDuration: 600, // 10 minutes in seconds
  breathingEnabled: true,
  sound: 'bell.mp3'
};

/**
 * Local storage key for user preferences
 */
const STORAGE_KEY = 'userPreferences';

/**
 * Validates user preferences object to ensure all required fields are present and valid
 */
const validatePreferences = (preferences: any): UserPreferences => {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (preferences && typeof preferences === 'object') {
    // Validate defaultDuration
    if (typeof preferences.defaultDuration === 'number' && 
        preferences.defaultDuration > 0 && 
        preferences.defaultDuration <= 3600) { // Max 1 hour
      validated.defaultDuration = preferences.defaultDuration;
    }

    // Validate breathingEnabled
    if (typeof preferences.breathingEnabled === 'boolean') {
      validated.breathingEnabled = preferences.breathingEnabled;
    }

    // Validate sound
    if (typeof preferences.sound === 'string' && preferences.sound.trim()) {
      validated.sound = preferences.sound.trim();
    }
  }

  return validated;
};

/**
 * Safely loads preferences from localStorage with error handling and validation
 */
const loadPreferencesFromStorage = (): UserPreferences => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return validatePreferences(parsed);
    }
  } catch (error) {
    console.warn('Error loading preferences from localStorage:', error);
  }
  return DEFAULT_PREFERENCES;
};

/**
 * Safely saves preferences to localStorage with error handling
 */
const savePreferencesToStorage = (preferences: UserPreferences): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error saving preferences to localStorage:', error);
    return false;
  }
};

/**
 * Return type for the useSettings hook
 */
interface UseSettingsReturn {
  /** Current user preferences */
  preferences: UserPreferences;
  /** Update user preferences */
  updatePreferences: (newPreferences: UserPreferences) => boolean;
  /** Reset preferences to default values */
  resetPreferences: () => boolean;
  /** Whether preferences are currently being saved */
  isSaving: boolean;
}

/**
 * A hook for managing user preferences with localStorage persistence.
 * Provides validation, error handling, and automatic synchronization.
 * 
 * @example
 * ```tsx
 * const { preferences, updatePreferences, resetPreferences } = useSettings();
 * 
 * const handleSave = (newPrefs: UserPreferences) => {
 *   const success = updatePreferences(newPrefs);
 *   if (success) {
 *     console.log('Preferences saved successfully');
 *   }
 * };
 * ```
 */
export const useSettings = (): UseSettingsReturn => {
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferencesFromStorage);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Update user preferences with validation and persistence
   */
  const updatePreferences = useCallback((newPreferences: UserPreferences): boolean => {
    setIsSaving(true);
    
    try {
      // Validate the new preferences
      const validatedPreferences = validatePreferences(newPreferences);
      
      // Update state
      setPreferences(validatedPreferences);
      
      // Save to localStorage
      const success = savePreferencesToStorage(validatedPreferences);
      
      setIsSaving(false);
      return success;
    } catch (error) {
      console.error('Error updating preferences:', error);
      setIsSaving(false);
      return false;
    }
  }, []);

  /**
   * Reset preferences to default values
   */
  const resetPreferences = useCallback((): boolean => {
    setIsSaving(true);
    
    try {
      setPreferences(DEFAULT_PREFERENCES);
      
      // Remove from localStorage
      localStorage.removeItem(STORAGE_KEY);
      
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error('Error resetting preferences:', error);
      setIsSaving(false);
      return false;
    }
  }, []);

  // Load preferences on mount and handle storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const newPreferences = loadPreferencesFromStorage();
        setPreferences(newPreferences);
      }
    };

    // Listen for storage changes from other tabs
    window.addEventListener('storage', handleStorageChange);
    
    // Load initial preferences
    const initialPreferences = loadPreferencesFromStorage();
    setPreferences(initialPreferences);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    isSaving,
  };
}; 