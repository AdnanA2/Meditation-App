import React, { useReducer, useEffect, useCallback } from 'react'
import { IconWrapper } from './ui/IconWrapper'

/**
 * A guided breathing prompt component that helps users follow breathing patterns.
 * Displays visual and text cues for inhaling, holding, and exhaling with customizable timing.
 * 
 * @example
 * ```tsx
 * <BreathingPrompt isActive={true} />
 * ```
 */
interface BreathingPromptProps {
  /** Whether the breathing prompt should be active and visible */
  isActive: boolean;
  /** Breathing cycle duration in milliseconds (default: 4000ms) */
  cycleDuration?: number;
  /** Countdown duration in seconds (default: 4) */
  countdownDuration?: number;
}

type BreathingPhase = 'Breathe In' | 'Hold' | 'Breathe Out';

type BreathingState = {
  /** Current breathing instruction text */
  prompt: BreathingPhase;
  /** Whether the prompt is currently visible */
  isVisible: boolean;
  /** Current countdown number */
  countdown: number;
}

type BreathingAction =
  | { type: 'SET_PROMPT'; payload: BreathingPhase }
  | { type: 'SET_VISIBILITY'; payload: boolean }
  | { type: 'SET_COUNTDOWN'; payload: number }
  | { type: 'RESET' }

const initialState: BreathingState = {
  prompt: 'Breathe In',
  isVisible: false,
  countdown: 4,
}

/**
 * Reducer function for managing breathing prompt state
 */
function breathingReducer(state: BreathingState, action: BreathingAction): BreathingState {
  switch (action.type) {
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload }
    case 'SET_VISIBILITY':
      return { ...state, isVisible: action.payload }
    case 'SET_COUNTDOWN':
      return { ...state, countdown: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

/**
 * Gets the appropriate emoji for each breathing phase
 */
const getPromptEmoji = (prompt: BreathingPhase): string => {
  switch (prompt) {
    case 'Breathe In': return '🌬️'
    case 'Hold': return '⏸️'
    case 'Breathe Out': return '💨'
    default: return '🫁'
  }
}

/**
 * Gets the appropriate animation class for each breathing phase
 */
const getAnimationClass = (prompt: BreathingPhase): string => {
  switch (prompt) {
    case 'Breathe In': return 'animate-breath-in'
    case 'Breathe Out': return 'animate-breath-out'
    default: return ''
  }
}

/**
 * Gets the appropriate variant for the icon wrapper based on breathing phase
 */
const getIconVariant = (prompt: BreathingPhase): 'primary' | 'success' | 'info' => {
  switch (prompt) {
    case 'Breathe In': return 'primary'
    case 'Hold': return 'info'
    case 'Breathe Out': return 'success'
    default: return 'primary'
  }
}

const BreathingPrompt = ({ 
  isActive, 
  cycleDuration = 4000,
  countdownDuration = 4 
}: BreathingPromptProps) => {
  const [state, dispatch] = useReducer(breathingReducer, initialState)

  const breathingCycle: BreathingPhase[] = ['Breathe In', 'Hold', 'Breathe Out']

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  // Main breathing cycle effect
  useEffect(() => {
    if (!isActive) {
      dispatch({ type: 'SET_VISIBILITY', payload: false })
      return
    }

    let currentIndex = 0
    let intervalId: number

    const startCycle = () => {
      intervalId = window.setInterval(() => {
        // Hide current prompt
        dispatch({ type: 'SET_VISIBILITY', payload: false })
        dispatch({ type: 'SET_COUNTDOWN', payload: countdownDuration })
        
        // Show next prompt after brief transition
        setTimeout(() => {
          dispatch({ type: 'SET_PROMPT', payload: breathingCycle[currentIndex] })
          dispatch({ type: 'SET_VISIBILITY', payload: true })
          currentIndex = (currentIndex + 1) % breathingCycle.length
        }, 500)
      }, cycleDuration)
    }

    // Start immediately
    dispatch({ type: 'SET_PROMPT', payload: breathingCycle[0] })
    dispatch({ type: 'SET_VISIBILITY', payload: true })
    dispatch({ type: 'SET_COUNTDOWN', payload: countdownDuration })
    
    startCycle()

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isActive, cycleDuration, countdownDuration, breathingCycle])

  // Countdown effect
  useEffect(() => {
    if (!state.isVisible || !isActive || state.countdown <= 0) return

    const countdownInterval = setInterval(() => {
      dispatch({ type: 'SET_COUNTDOWN', payload: state.countdown - 1 })
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [state.isVisible, state.countdown, isActive])

  if (!isActive) return null

  return (
    <div 
      id="breathing-prompt"
      className="flex flex-col items-center space-y-6 mt-8 p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200/30 dark:border-indigo-700/30"
      role="region"
      aria-label="Breathing guide"
      aria-live="polite"
    >
      <div 
        className={`flex items-center space-x-3 transition-all duration-700 ${
          state.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <IconWrapper
          variant={getIconVariant(state.prompt)}
          size="lg"
          className={getAnimationClass(state.prompt)}
          aria-label={`${state.prompt} icon`}
        >
          {getPromptEmoji(state.prompt)}
        </IconWrapper>
        
        <div className="text-center">
          <div 
            className="text-3xl font-light text-indigo-700 dark:text-indigo-300 tracking-wide"
            aria-label={`Current instruction: ${state.prompt}`}
          >
            {state.prompt}
          </div>
          {state.isVisible && state.countdown > 0 && state.countdown < countdownDuration && (
            <div 
              className="text-2xl text-indigo-500 dark:text-indigo-400 font-light mt-2 animate-pulse"
              aria-label={`Countdown: ${state.countdown} seconds`}
            >
              {state.countdown}
            </div>
          )}
        </div>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 font-light text-center opacity-75">
        Follow the breathing guide for a deeper meditation experience
      </p>
    </div>
  )
}

export default BreathingPrompt 