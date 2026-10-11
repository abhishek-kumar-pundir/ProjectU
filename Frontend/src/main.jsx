import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FastLoadProvider } from 'react-fastload'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FastLoadProvider
      strategy="adaptive"
      concurrency={4}
      preloadDistance={800}
    >
      <App />
    </FastLoadProvider>
  </StrictMode>,
)
