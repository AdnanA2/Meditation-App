import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  defaultDuration: number;
  breathingEnabled: boolean;
  sound: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultDuration: 600, // 10 minutes in seconds
  breathingEnabled: true,
  sound: 'bell.mp3'
};

export const useSettings = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('userPreferences');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  });

  const updatePreferences = useCallback((newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    try {
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    try {
      localStorage.removeItem('userPreferences');
    } catch (error) {
      console.error('Error resetting preferences:', error);
    }
  }, []);

  // Load preferences on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('userPreferences');
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading preferences on mount:', error);
    }
  }, []);

  return {
    preferences,
    updatePreferences,
    resetPreferences,
  };
}; 