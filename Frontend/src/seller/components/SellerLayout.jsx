import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, LogOut, Package, Plus, Settings, ShoppingBag, Store, Wallet } from 'lucide-react'
import BrandLogo from '../../components/layout/BrandLogo'
import PageContainer from '../../components/layout/PageContainer'
import ProductBreadcrumbs from '../../components/product/ProductBreadcrumbs'

const nav = [
  { to: '/seller/dashboard', label: 'Overview', icon: BarChart3, end: true },
  { to: '/seller/listings', label: 'Listings', icon: ShoppingBag },
  { to: '/seller/listings/new', label: 'Add listing', icon: Plus },
  { to: '/seller/orders', label: 'Orders', icon: Package },
  { to: '/seller/earnings', label: 'Earnings', icon: Wallet },
  { to: '/seller/settings', label: 'Shop settings', icon: Settings },
]

const pageTitles = {
  '/seller/dashboard': 'Seller overview',
  '/seller/listings': 'My listings',
  '/seller/listings/new': 'Add listing',
  '/seller/orders': 'Orders',
  '/seller/earnings': 'Earnings',
  '/seller/settings': 'Shop settings',
}

const pageDescriptions = {
  '/seller/dashboard': 'Track performance and recent orders at a glance.',
  '/seller/listings': 'View and manage your product listings.',
  '/seller/listings/new': 'Create a new product listing for your shop.',
  '/seller/orders': 'Review and update customer orders.',
  '/seller/earnings': 'Revenue summary, payouts, and exports.',
  '/seller/settings': 'Update shop profile and preferences.',
}

export default function SellerLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const isDashboard = location.pathname === '/seller/dashboard'
  const title = pageTitles[location.pathname] ?? 'Seller center'
  const description = pageDescriptions[location.pathname] ?? 'Manage your shop, listings, and orders.'

  const breadcrumbs = [
    { label: 'Seller home', to: '/seller/dashboard' },
    { label: title, to: null },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-dvh min-w-0 flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <PageContainer className="flex items-center justify-between gap-4 py-3.5">
          <div>
            <BrandLogo />
            <p className="mt-1 text-xs font-medium text-slate-500">Seller center</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Store className="h-4 w-4" />
            Marketplace
          </Link>
        </PageContainer>
      </header>

      <main className="min-w-0 flex-1">
        <PageContainer className="py-6 pb-10">
          <ProductBreadcrumbs items={breadcrumbs} />

          {!isDashboard && (
            <header className="mt-4">
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h1>
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            </header>
          )}

          <div className={`flex flex-col gap-4 lg:flex-row lg:items-start ${isDashboard ? 'mt-4' : 'mt-6'}`}>
            <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-52">
              <nav className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-1.5">
                {nav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? 'bg-dcc-primary text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                    {item.label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} />
                  Log out
                </button>
              </nav>
            </aside>

            <div className="min-w-0 flex-1">
              <Outlet />
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  )
}
