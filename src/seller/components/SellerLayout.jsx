
import {
  BarChart3,
  Bell,
  Package,
  Settings,
  ShoppingBag,
  Wallet,
  User,
} from 'lucide-react'

import PortalLayoutShell from '../../components/layout/PortalLayoutShell'

const nav = [
  {
    to: '/seller/dashboard',
    label: 'Overview',
    icon: BarChart3,
    end: true,
  },
  {
    to: '/seller/listings',
    label: 'Listings',
    icon: ShoppingBag,
  },
  {
    to: '/seller/orders',
    label: 'Orders',
    icon: Package,
  },
  {
    to: '/seller/earnings',
    label: 'Earnings',
    icon: Wallet,
  },
  {
    to: '/seller/notifications',
    label: 'Notifications',
    icon: Bell,
  },
  {
    to: '/seller/settings',
    label: 'Shop settings',
    icon: Settings,
  },
  {
    to: '/seller/profile',
    label: 'My profile',
    icon: User,
  },
]

const pageTitles = {
  '/seller/dashboard': 'Seller overview',
  '/seller/listings': 'My listings',
  '/seller/listings/new': 'Add listing',
  '/seller/orders': 'Orders',
  '/seller/earnings': 'Earnings',
  '/seller/notifications': 'Notifications',
  '/seller/settings': 'Shop settings',
  '/seller/profile': 'My profile',
}

const pageDescriptions = {
  '/seller/dashboard':
    'Track performance and recent orders at a glance.',

  '/seller/listings':
    'View and manage your product listings.',

  '/seller/listings/new':
    'Create a new product listing for your shop.',

  '/seller/orders':
    'Review and update customer orders.',

  '/seller/earnings':
    'Revenue summary, payouts, and exports.',

  '/seller/notifications':
    'Stay updated with your shop activity.',

  '/seller/settings':
    'Update shop profile and preferences.',

  '/seller/profile':
    'Manage personal credentials and verification details.',
}

export default function SellerLayout() {
  return (
    <PortalLayoutShell
      portalLabel="Seller center"
      homeBreadcrumb="Seller home"
      homePath="/seller/dashboard"
      navItems={nav}
      pageTitles={pageTitles}
      pageDescriptions={pageDescriptions}
      logoutRedirect="/login"
    />
  )
}
