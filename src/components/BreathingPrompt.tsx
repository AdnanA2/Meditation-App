import { useState, useEffect } from 'react'

interface BreathingPromptProps {
  isActive: boolean
}

const BreathingPrompt = ({ isActive }: BreathingPromptProps) => {
  const [prompt, setPrompt] = useState('Breathe In')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setIsVisible(false)
      return
    }

    const cycle = ['Breathe In', 'Hold', 'Breathe Out']
    let currentIndex = 0

    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setPrompt(cycle[currentIndex])
        setIsVisible(true)
        currentIndex = (currentIndex + 1) % cycle.length
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [isActive])

  if (!isActive) return null

  return (
    <div className={`text-2xl font-medium text-primary-600 dark:text-primary-400 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {prompt}
    </div>
  )
}

export default BreathingPrompt 