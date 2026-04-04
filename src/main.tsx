import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Disable browser scroll restoration BEFORE React mounts.
// This prevents the browser from jumping to the previously saved scroll
// position when the page is refreshed, which caused the Achievements section
// to appear instead of the top of the page.
if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
