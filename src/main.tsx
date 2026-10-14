import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { localeFromPath } from './lib/locale'

document.documentElement.lang = localeFromPath(window.location.pathname)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
