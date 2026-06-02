import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { UIProvider } from './context/UIContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UIProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </UIProvider>
    </AuthProvider>
  </StrictMode>,
)
