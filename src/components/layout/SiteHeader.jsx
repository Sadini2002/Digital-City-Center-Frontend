import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Heart, Menu, ShoppingCart, User, X, LogOut } from 'lucide-react'

import { useShop } from '../../buyer'
import UtilityTopBar from './UtilityTopBar'
import BrandLogo from './BrandLogo'
import HeaderSearch from './HeaderSearch'
import NotificationBell from '../notifications/NotificationBell'

import {
  getAuthToken,
  getStoredUser,
  clearAuthToken,
  clearStoredUser,
} from '../../utils/authStorage'

const navItems = [
  { to: '/', label: 'Home', end: true },
  {
    to: '/category/electronics',
    label: 'Categories',
    matchCategory: true,
  },
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

export default function SiteHeader({
  activeAuth = null,
  showUtilityBar = true,
}) {
  const location = useLocation()
  const navigate = useNavigate()

  const { cartCount, wishlistCount } = useShop()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState(() => getStoredUser())

  const token = getAuthToken()
  const isAuthenticated = Boolean(token && user)

  const isSeller =
    location.pathname.includes('/seller') ||
    location.pathname.includes('/register/seller')

  const isDelivery =
    location.pathname.includes('/delivery') ||
    location.pathname.includes('/register/delivery')

  const loginUrl = isDelivery
    ? '/login?portal=delivery'
    : isSeller
      ? '/login?portal=seller'
      : '/login'

  /*
   * Keep the header synchronized with localStorage.
   * This is useful after registration/login because
   * the header can immediately show the account.
   */
  useEffect(() => {
    const syncAuth = () => {
      const storedUser = getStoredUser()
      const storedToken = getAuthToken()

      setUser(storedToken && storedUser ? storedUser : null)
    }

    window.addEventListener('auth-changed', syncAuth)
    window.addEventListener('storage', syncAuth)

    syncAuth()

    return () => {
      window.removeEventListener('auth-changed', syncAuth)
      window.removeEventListener('storage', syncAuth)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false)
      }
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const handleLogout = () => {
    clearAuthToken()
    clearStoredUser()

    setUser(null)
    setMobileOpen(false)

    window.dispatchEvent(new Event('auth-changed'))

    navigate('/login')
  }

  const getFirstName = () => {
    if (!user) return 'My Account'

    const name =
      user.name ||
      user.fullName ||
      user.username ||
      user.email?.split('@')[0]

    if (!name) return 'My Account'

    return name.split(' ')[0]
  }

  return (
    <header className="sticky top-0 z-50">
      {showUtilityBar && <UtilityTopBar />}

      {/* MAIN HEADER */}
      <div className="border-b border-slate-200/80 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl min-w-0 items-center gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8">

          {/* MOBILE MENU */}
          <button
            type="button"
            className="touch-target shrink-0 rounded-lg p-2 text-slate-700 hover:bg-slate-50 lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* LOGO */}
          <BrandLogo />

          {/* SEARCH */}
          <div className="hidden min-w-0 flex-1 lg:block lg:mx-6">
            <HeaderSearch />
          </div>

          {/* RIGHT SIDE */}
          <div className="ml-auto flex min-w-0 shrink-0 items-center gap-0.5 sm:gap-1">

            {/* NOTIFICATIONS */}
            {isAuthenticated && <NotificationBell />}

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className="touch-target relative rounded-lg p-2 text-slate-600 hover:bg-slate-50"
              aria-label="Wishlist"
            >
              <Heart
                className="h-5 w-5"
                strokeWidth={1.75}
              />

              {wishlistCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* CART */}
            <Link
              to="/cart"
              className="touch-target relative rounded-lg p-2 text-slate-600 hover:bg-slate-50"
              aria-label="Cart"
            >
              <ShoppingCart
                className="h-5 w-5"
                strokeWidth={1.75}
              />

              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-dcc-primary px-1 text-[10px] font-bold text-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* ========================= */}
            {/* AUTHENTICATED USER */}
            {/* ========================= */}

            {isAuthenticated ? (
              <>
                {/* ACCOUNT BUTTON */}
                <Link
                  to="/account"
                  className="hidden items-center gap-2 rounded-lg border-2 border-dcc-primary bg-white px-3 py-2 text-sm font-semibold text-dcc-primary transition-colors hover:bg-violet-50 sm:flex"
                >
                  <User className="h-4 w-4" />

                  <span className="max-w-[120px] truncate">
                    {getFirstName()}
                  </span>
                </Link>

                {/* LOGOUT */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-red-600 sm:flex"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                {/* SIGN IN */}
                <Link
                  to={loginUrl}
                  className={`hidden rounded-lg border-2 px-4 py-2 text-sm font-semibold sm:inline ${
                    activeAuth === 'login'
                      ? 'border-dcc-primary bg-violet-50 text-dcc-primary'
                      : 'border-dcc-primary bg-white text-dcc-primary hover:bg-violet-50'
                  }`}
                >
                  Sign In
                </Link>

                {/* REGISTER */}
                <Link
                  to="/register"
                  className={`hidden rounded-lg px-3 py-2 text-sm font-semibold text-white sm:inline-flex sm:px-5 ${
                    activeAuth === 'register'
                      ? 'bg-dcc-primary-hover'
                      : 'bg-dcc-primary hover:bg-dcc-primary-hover'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP NAVIGATION */}
      <div className="hidden border-b border-slate-100 lg:block">
        <nav
          className="mx-auto flex max-w-7xl items-center gap-7 px-6 lg:gap-9 lg:px-8"
          aria-label="Main"
        >
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              item={item}
            />
          ))}
        </nav>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{
            top: 'var(--header-offset, 7rem)',
          }}
        >
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
                  item.matchCategory &&
                  location.pathname.startsWith('/category')

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
                )
              })}
            </nav>

            {/* MOBILE ACCOUNT */}
            <div className="mt-4 border-t border-slate-100 pt-4">

              {isAuthenticated ? (
                <div className="flex flex-col gap-2">

                  <Link
                    to="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg bg-violet-50 px-4 py-3 font-semibold text-dcc-primary"
                  >
                    <User className="h-5 w-5" />

                    <span>
                      My Account
                      <span className="ml-1 font-normal">
                        ({getFirstName()})
                      </span>
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-left font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>

                </div>
              ) : (
                <div className="flex flex-col gap-2">

                  <Link
                    to={loginUrl}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg border-2 border-dcc-primary px-4 py-3 text-center text-sm font-semibold text-dcc-primary"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg bg-dcc-primary px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Register
                  </Link>

                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </header>
  )
}