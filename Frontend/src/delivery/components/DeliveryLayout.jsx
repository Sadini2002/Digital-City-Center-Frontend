/** BACKEND: Sidebar notification badge — GET /delivery/notifications */
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  LayoutDashboard,
  Settings,
  Truck,
  Users,
  Wallet,
} from 'lucide-react'
import PortalLayoutShell from '../../components/layout/PortalLayoutShell'
import { getUnreadNotificationCount } from '../utils/deliveryStorage'
import {
  getDeliveryDisplayName,
  getDeliveryRoleLabel,
  readDeliveryUser,
} from '../utils/readDeliveryUser'

const providerNav = [
  { to: '/delivery', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/delivery/deliveries', label: 'Deliveries', icon: Truck },
  { to: '/delivery/drivers', label: 'Drivers', icon: Users },
  { to: '/delivery/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/delivery/earnings', label: 'Earnings', icon: Wallet },
  { to: '/delivery/settings', label: 'Settings', icon: Settings },
  { to: '/delivery/notifications', label: 'Notifications', icon: Bell },
]

const driverNav = [
  { to: '/delivery', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/delivery/deliveries', label: 'Deliveries', icon: Truck },
  { to: '/delivery/profile', label: 'My profile', icon: Users },
  { to: '/delivery/earnings', label: 'Earnings', icon: Wallet },
  { to: '/delivery/notifications', label: 'Notifications', icon: Bell },
]

const pageTitles = {
  '/delivery': 'Delivery dashboard',
  '/delivery/deliveries': 'Deliveries',
  '/delivery/drivers': 'Fleet drivers',
  '/delivery/analytics': 'Fleet analytics',
  '/delivery/earnings': 'Earnings',
  '/delivery/settings': 'Settings',
  '/delivery/notifications': 'Notifications',
  '/delivery/profile': 'My profile',
}

const pageDescriptions = {
  '/delivery': 'Your hub for jobs, earnings, and fleet performance.',
  '/delivery/deliveries':
    'Browse your assigned runs or accept new jobs from the available pool.',
  '/delivery/drivers': 'Invite riders and control who is available for assignments.',
  '/delivery/analytics': 'Track completion rates and average delivery times.',
  '/delivery/earnings': 'See what you have earned from completed deliveries.',
  '/delivery/settings': 'Configure your delivery coverage areas and pricing rates.',
  '/delivery/notifications': 'Stay on top of new assignments and status changes.',
  '/delivery/profile': 'Update availability and view your driver details.',
}

function resolveDeliveryPageMeta(pathname) {
  if (/^\/delivery\/deliveries\/[^/]+\/tracking$/.test(pathname)) {
    return { title: 'Route tracking', description: 'Live GPS and route for this delivery.' }
  }
  if (/^\/delivery\/deliveries\/[^/]+$/.test(pathname)) {
    return { title: 'Delivery detail', description: 'Addresses, status history, and actions.' }
  }
  return null
}

export default function DeliveryLayout() {
  const location = useLocation()
  const user = readDeliveryUser()
  const isProvider = user?.role === 'DELIVERY_PROVIDER'
  const nav = isProvider ? providerNav : driverNav
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    setUnreadCount(getUnreadNotificationCount())
  }, [location.pathname])

  return (
    <PortalLayoutShell
      portalLabel="Delivery portal"
      homeBreadcrumb="Delivery home"
      homePath="/delivery"
      navSectionLabel="Workspace"
      navItems={nav}
      pageTitles={pageTitles}
      pageDescriptions={pageDescriptions}
      logoutRedirect="/login?portal=delivery"
      resolvePageMeta={resolveDeliveryPageMeta}
      portalHeaderExtra={
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">{getDeliveryDisplayName(user)}</p>
          <p className="text-xs text-slate-500">{getDeliveryRoleLabel(user)}</p>
        </div>
      }
      renderNavExtra={(item) =>
        item.to === '/delivery/notifications' && unreadCount > 0 ? (
          <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null
      }
    />
  )
}
