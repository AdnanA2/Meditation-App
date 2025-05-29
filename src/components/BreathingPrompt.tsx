import { useReducer, useEffect } from 'react'

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

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={`text-2xl font-medium text-indigo-600 dark:text-indigo-400 transition-opacity duration-500 ${state.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {state.prompt}
      </div>
      {state.isVisible && state.countdown > 0 && state.countdown < 4 && (
        <div className="text-xl text-gray-500 dark:text-gray-400 animate-pulse">
          {state.countdown}
        </div>
      )}
    </div>
  )
}

export default BreathingPrompt 