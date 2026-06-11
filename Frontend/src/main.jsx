import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { getAuthToken, hydrateAuthFromSession, setAuthToken } from './utils/authStorage'

async function bootstrap() {
  await hydrateAuthFromSession()

  const legacyToken = localStorage.getItem('token')
  if (legacyToken && !getAuthToken()) {
    await setAuthToken(legacyToken, localStorage.getItem('rememberMe') === 'true')
    localStorage.removeItem('token')
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
