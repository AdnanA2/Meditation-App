import { Button } from './ui/Button';

export type NavigationTab = 'timer' | 'analytics' | 'achievements';

interface NavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'timer' as const, label: 'Timer', icon: '🧘‍♂️' },
    { id: 'analytics' as const, label: 'Analytics', icon: '📈' },
    { id: 'achievements' as const, label: 'Achievements', icon: '🏆' }
  ];

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }
            `}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="font-medium text-sm">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}; 