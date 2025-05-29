import { Layout } from './components/Layout'

function App() {
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-display-2 font-display text-primary-600 dark:text-primary-400">
          Meditation App
        </h1>
        <p className="text-body-lg text-earth-700 dark:text-earth-300">
          Begin your journey to mindfulness
        </p>
      </div>
    </Layout>
  )
}

export default App
