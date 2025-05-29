import Header from './components/Header';
import Timer from './components/Timer';
import SessionHistory from './components/SessionHistory';
import StreakTracker from './components/StreakTracker';

function App() {
  const handleSessionComplete = () => {
    // This will be called when a meditation session is completed
    // The Timer component will handle updating the session history internally
    console.log('Meditation session completed');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header />
      <main className="mt-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <StreakTracker />
        <Timer onSessionComplete={handleSessionComplete} />
        <SessionHistory />
      </main>
    </div>
  );
}

export default App; 