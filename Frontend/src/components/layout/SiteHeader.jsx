import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Heart, Menu, ShoppingCart, X } from 'lucide-react'
import UtilityTopBar from './UtilityTopBar'
import BrandLogo from './BrandLogo'
import HeaderSearch from './HeaderSearch'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/category/electronics', label: 'Categories', matchCategory: true },
  { to: '/shops', label: 'Shops' },
  { to: '/deals', label: 'Deals', hot: true },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
]

function NavItem({ item, onClick }) {
  const location = useLocation()
  const isCategoryActive =
    item.matchCategory && location.pathname.startsWith('/category')

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'group relative whitespace-nowrap py-3 text-sm font-medium transition-colors',
          isActive || isCategoryActive
            ? 'text-dcc-primary'
            : 'text-slate-600 hover:text-dcc-primary',
        ].join(' ')
      }
    >
      {({ isActive }) => {
        const active = isActive || isCategoryActive
        return (
          <>
            <span className="inline-flex items-center gap-1">
              {item.label}
              {item.hot && (
                <span className="rounded-sm bg-red-500 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-white">
                  HOT
                </span>
              )}
            </span>
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-dcc-primary" />
            )}
          </>
        )
      }}
    </NavLink>
  )
}

export default function SiteHeader({ activeAuth = null, showUtilityBar = true }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      {showUtilityBar && <UtilityTopBar />}

      <div className="border-b border-slate-200/80 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl min-w-0 items-center gap-3 px-3 sm:px-6 lg:px-8">
          <BrandLogo />

          <div className="hidden min-w-0 flex-1 md:block lg:mx-6">
            <HeaderSearch />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
            <Link
              to="/wishlist"
              className="touch-target rounded-lg p-2 text-slate-600 hover:bg-slate-50"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" strokeWidth={1.75} />
            </Link>
            <Link
              to="/cart"
              className="touch-target relative rounded-lg p-2 text-slate-600 hover:bg-slate-50"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-dcc-primary px-1 text-[10px] font-bold text-white">
                2
              </span>
            </Link>

            <Link
              to="/login"
              className={`hidden rounded-lg border-2 px-4 py-2 text-sm font-semibold sm:inline ${
                activeAuth === 'login'
                  ? 'border-dcc-primary bg-violet-50 text-dcc-primary'
                  : 'border-dcc-primary bg-white text-dcc-primary hover:bg-violet-50'
              }`}
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className={`rounded-lg px-3 py-2 text-sm font-semibold text-white sm:px-5 ${
                activeAuth === 'register'
                  ? 'bg-dcc-primary-hover'
                  : 'bg-dcc-primary hover:bg-dcc-primary-hover'
              }`}
            >
              Register
            </Link>

            <button
              type="button"
              className="touch-target rounded-lg p-2 text-slate-700 hover:bg-slate-50 md:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden border-b border-slate-100 md:block">
        <nav
          className="mx-auto flex max-w-7xl items-center gap-7 px-6 lg:gap-9 lg:px-8"
          aria-label="Main"
        >
          {navItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ top: 'var(--header-offset, 7rem)' }}>
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close"
          />
          <div className="absolute left-0 right-0 max-h-[70dvh] overflow-y-auto bg-white p-4 shadow-xl">
            <HeaderSearch className="mb-4" />
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const categoryActive =
                  item.matchCategory && location.pathname.startsWith('/category')
                return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-3 text-base font-medium ${
                      isActive || categoryActive
                        ? 'bg-violet-50 text-dcc-primary'
                        : 'text-slate-700'
                    }`
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    {item.label}
                    {item.hot && (
                      <span className="rounded bg-red-500 px-1 text-[10px] font-bold text-white">
                        HOT
                      </span>
                    )}
                  </span>
                </NavLink>
              )})}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
