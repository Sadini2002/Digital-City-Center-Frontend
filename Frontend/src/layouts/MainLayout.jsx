import { Outlet } from 'react-router-dom'
import { Footer, Header, TopBar } from '@/components/layout'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-2"
      >
        Skip to main content
      </a>
      <TopBar />
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
