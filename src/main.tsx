import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { localeFromPath } from './lib/locale'
import { applyProjectTheme } from './lib/projectTheme'

document.documentElement.lang = localeFromPath(window.location.pathname)
// Set the page identity before React renders navigation, loading states, or dialogs.
applyProjectTheme(document.documentElement, window.location.pathname)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
