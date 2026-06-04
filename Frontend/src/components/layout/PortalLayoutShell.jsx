import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Store } from 'lucide-react'
import SiteLayout from '../../layouts/SiteLayout'
import BrandLogo from './BrandLogo'
import PageContainer from './PageContainer'
import ProductBreadcrumbs from '../product/ProductBreadcrumbs'

/**
 * Shared chrome for seller + delivery dashboards: marketplace header/footer
 * plus the slim portal strip (logo, portal label, marketplace link).
 */
export default function PortalLayoutShell({
  portalLabel,
  homeBreadcrumb,
  homePath,
  navItems,
  pageTitles = {},
  pageDescriptions = {},
  logoutRedirect = '/login',
  renderNavExtra,
  resolvePageMeta,
  portalHeaderExtra,
  navSectionLabel = 'Menu',
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const isDashboard = location.pathname === homePath
  const resolved = resolvePageMeta?.(location.pathname)
  const title = resolved?.title ?? pageTitles[location.pathname] ?? portalLabel
  const description =
    resolved?.description ??
    pageDescriptions[location.pathname] ??
    `Manage your ${portalLabel.toLowerCase()}.`

  const breadcrumbs = [
    { label: homeBreadcrumb, to: homePath },
    { label: title, to: null },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate(logoutRedirect, { replace: true })
  }

  return (
    <SiteLayout className="bg-slate-50" showHeader={false} showFooter={false}>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white shadow-sm">
          <PageContainer className="flex flex-wrap items-center justify-between gap-4 py-3.5">
            <div className="min-w-0">
              <BrandLogo />
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-dcc-primary">
                {portalLabel}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {portalHeaderExtra}
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <Store className="h-4 w-4" />
                Marketplace
              </Link>
            </div>
          </PageContainer>
        </header>

        <main className="min-w-0 flex-1">
          <PageContainer className="py-6 pb-10">
            <ProductBreadcrumbs items={breadcrumbs} />

            {!isDashboard && (
              <header className="mt-4 rounded-xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm sm:px-5">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
              </header>
            )}

            <div
              className={`flex flex-col gap-4 lg:flex-row lg:items-start ${
                isDashboard ? 'mt-4' : 'mt-6'
              }`}
            >
              <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-56">
                <p className="mb-2 hidden px-1 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:block">
                  {navSectionLabel}
                </p>
                <nav className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
                  {navItems.map((item) => (
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
                      <span className="flex-1">{item.label}</span>
                      {renderNavExtra?.(item)}
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
    </SiteLayout>
  )
}
