export type Theme = 'light' | 'dark';

export const getInitialTheme = (): Theme => {
  // Check localStorage first
  const storedTheme = localStorage.getItem('theme') as Theme;
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  // Fallback to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme: Theme): void => {
  const root = window.document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  localStorage.setItem('theme', theme);
};

export const toggleTheme = (): Theme => {
  const currentTheme = getInitialTheme();
  const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
  return newTheme;
}; 