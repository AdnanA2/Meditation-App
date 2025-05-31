/**
 * Navigation component for switching between different app sections
 * 
 * @component
 * @example
 * ```tsx
 * <Navigation 
 *   activeTab="timer" 
 *   onTabChange={(tab) => setActiveTab(tab)} 
 * />
 * ```
 */

import { useEffect, useRef } from 'react';

export type NavigationTab = 'timer' | 'analytics' | 'achievements';

interface NavigationProps {
  /** Currently active tab */
  activeTab: NavigationTab;
  /** Callback function when tab changes */
  onTabChange: (tab: NavigationTab) => void;
}

interface TabConfig {
  id: NavigationTab;
  label: string;
  icon: string;
  ariaLabel: string;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabsRef = useRef<HTMLDivElement>(null);

  const tabs: TabConfig[] = [
    { 
      id: 'timer', 
      label: 'Timer', 
      icon: '🧘', 
      ariaLabel: 'Meditation timer and session controls' 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: '📊', 
      ariaLabel: 'View meditation statistics and progress charts' 
    },
    { 
      id: 'achievements', 
      label: 'Achievements', 
      icon: '🏆', 
      ariaLabel: 'View unlocked achievements and goals' 
    }
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!tabsRef.current?.contains(event.target as Node)) return;

      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      let newIndex = currentIndex;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          break;
        case 'ArrowRight':
          event.preventDefault();
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          newIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      onTabChange(tabs[newIndex].id);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, onTabChange, tabs]);

  return (
    <nav 
      className="w-full max-w-lg mx-auto mb-8"
      role="navigation"
      aria-label="Main navigation"
    >
      <div 
        ref={tabsRef}
        className="flex bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-gray-200/30 dark:border-gray-700/30 transition-all duration-300 hover:shadow-xl"
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-full transition-all duration-300 font-medium text-sm relative overflow-hidden group
              ${activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105 ring-2 ring-indigo-200 dark:ring-indigo-800'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 hover:scale-102'
              }
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-white/50 dark:focus:ring-offset-gray-800/50
            `}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            aria-label={tab.ariaLabel}
            tabIndex={activeTab === tab.id ? 0 : -1}
          >
            {/* Background animation for hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            
            <span 
              className={`text-lg transition-transform duration-300 ${
                activeTab === tab.id ? 'animate-bounce-gentle' : 'group-hover:scale-110'
              }`}
              role="img" 
              aria-hidden="true"
            >
              {tab.icon}
            </span>
            <span className="hidden sm:inline relative z-10">{tab.label}</span>
            
            {/* Active indicator */}
            {activeTab === tab.id && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>
      
      {/* Screen reader instructions */}
      <div className="sr-only">
        Use arrow keys to navigate between tabs, Home and End keys to jump to first and last tabs.
      </div>
    </nav>
  );
}; 