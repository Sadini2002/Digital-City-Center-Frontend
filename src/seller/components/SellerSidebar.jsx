import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wallet,
  Settings,
  User,
  Bell,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navigationItems = [
  {
    label: 'Dashboard',
    path: '/seller/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Listings',
    path: '/seller/listings',
    icon: Package,
  },
  {
    label: 'Orders',
    path: '/seller/orders',
    icon: ShoppingBag,
  },
  {
    label: 'Earnings',
    path: '/seller/earnings',
    icon: Wallet,
  },
  {
    label: 'Notifications',
    path: '/seller/notifications',
    icon: Bell,
  },
  {
    label: 'Shop Settings',
    path: '/seller/settings',
    icon: Settings,
  },
  {
    label: 'Profile',
    path: '/seller/profile',
    icon: User,
  },
]

export default function SellerSidebar({ mobile = false, onNavigate }) {
  return (
    <nav
      className={
        mobile
          ? 'flex flex-col gap-2 p-4'
          : 'flex h-full flex-col gap-2 p-4'
      }
    >
      {navigationItems.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              ].join(' ')
            }
          >
            <Icon size={19} />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}