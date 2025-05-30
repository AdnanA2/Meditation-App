/**
 * Theme type definition
 */
export type Theme = 'light' | 'dark';

/**
 * Gets the initial theme based on localStorage or system preference
 * @returns The initial theme
 */
export const getInitialTheme = (): Theme => {
  try {
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Applies the specified theme to the document
 * @param theme - The theme to apply
 */
export const applyTheme = (theme: Theme): void => {
  const root = window.document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

/**
 * Toggles between light and dark themes
 * @returns The new theme
 */
export const toggleTheme = (): Theme => {
  const currentTheme = getInitialTheme();
  const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
  return newTheme;
};

/**
 * Sets up a listener for system theme preference changes
 * @param callback - Function to call when system theme changes
 */
export const watchSystemTheme = (callback: (theme: Theme) => void): void => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    const newTheme: Theme = e.matches ? 'dark' : 'light';
    callback(newTheme);
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handleChange);
}; 