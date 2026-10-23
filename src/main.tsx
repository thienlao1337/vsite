import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import '@fontsource/nunito/cyrillic-400.css'
import '@fontsource/nunito/cyrillic-500.css'
import '@fontsource/nunito/cyrillic-600.css'
import '@fontsource/nunito/cyrillic-700.css'
import '@fontsource/nunito/latin-400.css'
import '@fontsource/nunito/latin-600.css'
import '@fontsource/lora/cyrillic-400.css'
import '@fontsource/lora/cyrillic-400-italic.css'
import '@fontsource/lora/latin-400.css'
import '@fontsource/lora/latin-400-italic.css'
import App from './App'
import './styles.css'

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? (
      <main className="error-fallback">
        <h1>Маленькое облачко запуталось</h1>
        <p>Твои звёздочки бережно сохранены, если браузер разрешил хранение.</p>
        <button onClick={() => window.location.reload()}>попробовать снова</button>
      </main>
    ) : (
      this.props.children
    )
  }
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </ErrorBoundary>
  </React.StrictMode>,
)
