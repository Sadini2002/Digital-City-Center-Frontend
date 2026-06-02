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

export default function SellerLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const title = pageTitles[location.pathname] ?? 'Seller center'

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
    <div className="flex min-h-dvh min-w-0 flex-col bg-slate-50/70">
      <header className="border-b border-slate-200 bg-white">
        <PageContainer className="flex items-start justify-between gap-3 py-4">
          <div className="flex flex-col">
            <BrandLogo />
            <span className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">Seller center</span>
          </div>

          <Link
            to="/"
            className="mt-1 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Store className="h-4 w-4 text-slate-700" />
            Marketplace
          </Link>
        </PageContainer>
      </header>

      <main className="min-w-0 flex-1">
      <PageContainer className="pb-12">
        <ProductBreadcrumbs items={breadcrumbs} />
        <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">Manage your shop, listings, and orders.</p>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          <nav className="flex w-full flex-col gap-2 lg:w-56">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold ${
                    isActive
                      ? 'bg-dcc-primary text-white shadow-sm'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300'
                  }`
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Log out
            </button>
          </nav>

          <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </PageContainer>
      </main>
    </div>
  )
}
