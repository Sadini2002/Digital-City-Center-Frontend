import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BarChart3, Bell, Layers, LogOut, MapPin, Menu, Package, Percent, Search, Sparkles, Truck, Users2, User, Settings, X } from 'lucide-react'
import { ADMIN_ROLE_LABELS, getAdminAllowedSections, normalizeAdminRole } from '../utils/adminRole'
import { clearAdminToken } from '../../utils/authStorage'

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: BarChart3, end: true },
  { to: '/admin/sellers', label: 'Sellers', icon: Users2 },
  { to: '/admin/categories', label: 'Categories', icon: Layers },
  { to: '/admin/orders', label: 'Orders', icon: Package },
  { to: '/admin/delivery', label: 'Delivery Providers', icon: Truck },
  { to: '/admin/announcements', label: 'Announcements', icon: Bell },
  { to: '/admin/commission', label: 'Commission', icon: Percent },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Delivery Pricing', icon: Settings },
  { to: '/admin/settings#coverage-area-management', label: 'Coverage Areas', icon: MapPin },
  { to: '/admin/profile', label: 'My Profile', icon: User },
]

function AdminNavLinks({ items, onNavigate }) {
  return (
    <>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `inline-flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
              isActive
                ? 'bg-gradient-to-r from-dcc-primary to-[#6f2bff] text-white shadow-lg shadow-violet-900/35'
                : 'text-slate-200 hover:bg-white/10'
            }`
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </>
  )
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  let adminRole = null
  try {
    const user = JSON.parse(localStorage.getItem('admin_user') || '{}')
    adminRole = normalizeAdminRole(user?.role)
  } catch {
    adminRole = null
  }

  const allowed = new Set(getAdminAllowedSections(adminRole))
  const visibleNav = nav.filter((item) => {
    const section = item.to.replace('/admin/', '').split('#')[0].split('/')[0] || 'dashboard'
    return allowed.has(section)
  })

  const handleLogout = async () => {
    await clearAdminToken()
    localStorage.removeItem('admin_user')
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-white/10 bg-gradient-to-b from-dcc-topbar via-[#24124a] to-[#1d1138] px-5 py-6 text-center text-slate-100 lg:flex">
        <p className="text-3xl font-bold">Admin Panel</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-200/80">Digital City Center</p>
        <p className="mt-2 text-xs font-semibold text-violet-100/80">
          {ADMIN_ROLE_LABELS[adminRole] ?? 'Admin'}
        </p>
        <nav className="mt-12 space-y-2">
          <AdminNavLinks items={visibleNav} />
        </nav>
        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex w-full items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            aria-label="Close navigation menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-gradient-to-b from-dcc-topbar via-[#24124a] to-[#1d1138] px-5 py-6 text-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">Admin Menu</p>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-lg p-2 text-slate-200 hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="mt-8 space-y-2">
              <AdminNavLinks items={visibleNav} onNavigate={() => setMobileNavOpen(false)} />
            </nav>
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-dcc-primary/15 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-violet-200 p-2 text-dcc-primary lg:hidden"
              aria-label="Open navigation menu"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="text-base font-semibold text-slate-900 sm:text-lg">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-lg border border-dcc-primary/20 bg-dcc-auth px-3 py-1.5 sm:flex">
              <Search className="h-4 w-4 text-dcc-accent" />
              <span className="text-sm text-slate-500">Search...</span>
            </div>
            <span className="rounded-full bg-dcc-primary/10 px-2.5 py-1 text-xs font-semibold text-dcc-primary">
              Admin
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg border border-dcc-primary/20 bg-dcc-primary/5 px-2.5 py-1.5 text-xs font-semibold text-dcc-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Live
            </button>
          </div>
        </header>

        <main className="min-h-[calc(100vh-60px)] bg-gradient-to-br from-white via-dcc-auth to-violet-50/40 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

