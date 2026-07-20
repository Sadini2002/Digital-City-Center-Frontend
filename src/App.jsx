import { Toaster } from 'react-hot-toast'
import { ShopProvider } from './buyer'
import AppRouter from './router/AppRouter'

function App() {
  return (
    <ShopProvider>
      <AppRouter />
      <Toaster position="top-right" />
    </ShopProvider>
  )
}

export default App
