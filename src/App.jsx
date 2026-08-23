import { Toaster } from 'react-hot-toast'
import { ShopProvider } from './buyer'
import { NotificationProvider } from './context/NotificationContext'
import AppRouter from './router/AppRouter'

function App() {
  return (
    <ShopProvider>
      <NotificationProvider>
        <AppRouter />
        <Toaster position="top-right" />
      </NotificationProvider>
    </ShopProvider>
  )
}

export default App
