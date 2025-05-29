/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Calming, meditation-focused color palette
        primary: {
          50: '#f0f7ff',
          100: '#e0f0ff',
          200: '#bae0ff',
          300: '#7dc8ff',
          400: '#38b0ff',
          500: '#0099ff',
          600: '#0077cc',
          700: '#005599',
          800: '#003366',
          900: '#001133',
        },
        // Earth tones for grounding
        earth: {
          50: '#faf6f1',
          100: '#f5ede3',
          200: '#ebdbc7',
          300: '#e0c9ab',
          400: '#d5b78f',
          500: '#caa573',
          600: '#a2845c',
          700: '#7a6345',
          800: '#52422e',
          900: '#2a2117',
        },
        // Accent colors for focus points
        accent: {
          calm: '#7dd3fc',
          focus: '#38bdf8',
          energy: '#0ea5e9',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter var', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-2': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-3': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading-1': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-2': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-3': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'breath-in': 'breathIn 4s ease-in-out infinite',
        'breath-out': 'breathOut 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        breathIn: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        breathOut: {
          '0%, 100%': { transform: 'scale(1.1)' },
          '50%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
} 