import { ShopProvider } from './buyer'
import AppRouter from './router/AppRouter'

function App() {
  return (
    <ShopProvider>
      <AppRouter />
    </ShopProvider>
  )
}

export default App
