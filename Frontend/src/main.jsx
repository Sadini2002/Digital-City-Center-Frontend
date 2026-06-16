import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { getAuthToken, setAuthToken } from './utils/authStorage'

const legacyToken = localStorage.getItem('token')
if (legacyToken && !getAuthToken()) {
  void setAuthToken(legacyToken, localStorage.getItem('rememberMe') === 'true')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
