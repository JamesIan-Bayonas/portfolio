import { applyThemePreference } from "./lib/themePreference"
import { PortfolioMotionProvider } from "./components/MotionPreferences"
import { applyMotionPreference } from "./lib/motionPreference"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { localeFromPath } from './lib/locale'
import { applyProjectTheme } from './lib/projectTheme'

document.documentElement.lang = localeFromPath(window.location.pathname)
applyThemePreference()
applyMotionPreference()
// Set the page identity before React renders navigation, loading states, or dialogs.
applyProjectTheme(document.documentElement, window.location.pathname)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PortfolioMotionProvider><App /></PortfolioMotionProvider>
  </React.StrictMode>,
)
