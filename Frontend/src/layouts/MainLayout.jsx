import { Outlet } from 'react-router-dom'
import SiteLayout from './SiteLayout'

function MainLayout() {
  return (
    <SiteLayout className="bg-white">
      <main className="w-full min-w-0 flex-1">
        <Outlet />
      </main>
    </SiteLayout>
  )
}

export default MainLayout
