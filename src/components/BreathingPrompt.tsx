import { useState, useEffect } from 'react'

interface BreathingPromptProps {
  isActive: boolean
}

const BreathingPrompt = ({ isActive }: BreathingPromptProps) => {
  const [prompt, setPrompt] = useState('Breathe In')
  const [isVisible, setIsVisible] = useState(false)
  const [countdown, setCountdown] = useState(4)

  useEffect(() => {
    if (!isActive) {
      setIsVisible(false)
      return
    }

    const cycle = ['Breathe In', 'Hold', 'Breathe Out']
    let currentIndex = 0

    const interval = setInterval(() => {
      setIsVisible(false)
      setCountdown(4)
      
      setTimeout(() => {
        setPrompt(cycle[currentIndex])
        setIsVisible(true)
        currentIndex = (currentIndex + 1) % cycle.length
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [isActive])

  useEffect(() => {
    if (!isVisible || !isActive) return

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 4
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [isVisible, isActive])

  if (!isActive) return null

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={`text-2xl font-medium text-primary-600 dark:text-primary-400 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {prompt}
      </div>
      {isVisible && countdown > 0 && countdown < 4 && (
        <div className="text-xl text-gray-500 dark:text-gray-400 animate-pulse">
          {countdown}
        </div>
      )}
    </div>
  )
}

export default BreathingPrompt 