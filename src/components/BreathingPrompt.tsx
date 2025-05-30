import React, { useReducer, useEffect } from 'react'

interface BreathingPromptProps {
  isActive: boolean
}

type BreathingState = {
  prompt: string
  isVisible: boolean
  countdown: number
}

type BreathingAction =
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_VISIBILITY'; payload: boolean }
  | { type: 'SET_COUNTDOWN'; payload: number }
  | { type: 'RESET' }

const initialState: BreathingState = {
  prompt: 'Breathe In',
  isVisible: false,
  countdown: 4,
}

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

const BreathingPrompt = ({ isActive }: BreathingPromptProps) => {
  const [state, dispatch] = useReducer(breathingReducer, initialState)

  useEffect(() => {
    if (!isActive) {
      dispatch({ type: 'SET_VISIBILITY', payload: false })
      return
    }

    const cycle = ['Breathe In', 'Hold', 'Breathe Out']
    let currentIndex = 0

    const interval = setInterval(() => {
      dispatch({ type: 'SET_VISIBILITY', payload: false })
      dispatch({ type: 'SET_COUNTDOWN', payload: 4 })
      
      setTimeout(() => {
        dispatch({ type: 'SET_PROMPT', payload: cycle[currentIndex] })
        dispatch({ type: 'SET_VISIBILITY', payload: true })
        currentIndex = (currentIndex + 1) % cycle.length
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [isActive])

  useEffect(() => {
    if (!state.isVisible || !isActive) return

    const countdownInterval = setInterval(() => {
      dispatch({ type: 'SET_COUNTDOWN', payload: state.countdown - 1 })
    }, 1000)

    if (state.countdown <= 1) {
      clearInterval(countdownInterval)
    }

    return () => clearInterval(countdownInterval)
  }, [state.isVisible, state.countdown, isActive])

  if (!isActive) return null

  const getPromptEmoji = (prompt: string) => {
    switch (prompt) {
      case 'Breathe In': return '🌬️'
      case 'Hold': return '⏸️'
      case 'Breathe Out': return '💨'
      default: return '🫁'
    }
  }

  const getAnimationClass = (prompt: string) => {
    switch (prompt) {
      case 'Breathe In': return 'animate-breath-in'
      case 'Breathe Out': return 'animate-breath-out'
      default: return ''
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6 mt-8 p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200/30 dark:border-indigo-700/30">
      <div className={`flex items-center space-x-3 transition-all duration-700 ${state.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className={`w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center ${getAnimationClass(state.prompt)}`}>
          <span className="text-2xl">{getPromptEmoji(state.prompt)}</span>
        </div>
        <div className="text-center">
          <div className="text-3xl font-light text-indigo-700 dark:text-indigo-300 tracking-wide">
            {state.prompt}
          </div>
          {state.isVisible && state.countdown > 0 && state.countdown < 4 && (
            <div className="text-2xl text-indigo-500 dark:text-indigo-400 font-light mt-2 animate-pulse">
              {state.countdown}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 font-light text-center opacity-75">
        Follow the breathing guide for a deeper meditation experience
      </div>
    </div>
  )
}

export default BreathingPrompt 