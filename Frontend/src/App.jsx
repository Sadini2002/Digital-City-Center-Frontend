import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ShopProvider } from './buyer'
import AppRouter from './router/AppRouter'

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <AppRouter />
        <Toaster position="top-right" />
      </ShopProvider>
    </AuthProvider>
  )
}

export default App
