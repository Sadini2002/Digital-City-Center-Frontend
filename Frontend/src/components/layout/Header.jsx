import { Link, useNavigate } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import { useAuth, useUI } from '@/hooks'
import { useCart } from '@/context/CartContext'
import NotificationBell from '@/components/realtime/NotificationBell'
import { APP_NAME, ROLES } from '@/utils/constants'
import { getDashboardPath, getDashboardLabel, isMarketplaceRole } from '@/utils/roleNavigation'
import Navbar from './Navbar'
import SearchAutocomplete from '@/components/search/SearchAutocomplete'

export default function Header() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const { toggleMobileMenu, isMobileMenuOpen, closeMobileMenu } = useUI()
  const [searchQuery, setSearchQuery] = useState('')
  const { itemCount } = useCart()
  const dashboardPath = user?.role ? getDashboardPath(user.role) : '/account'
  const dashboardLabel = user?.role ? getDashboardLabel(user.role) : 'My Account'
  const showMarketplaceActions = !isAuthenticated || isMarketplaceRole(user?.role)

  const handleSearch = (event) => {
    event.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      closeMobileMenu()
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-[var(--shadow-header)]">
      <div className="container-dcc py-4">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
              D
            </span>
            <span className="hidden text-lg font-bold text-primary sm:block">{APP_NAME}</span>
          </Link>

          <div className="hidden max-w-2xl flex-1 md:block">
            <SearchAutocomplete className="mx-auto w-full" />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {isAuthenticated && user?.role !== ROLES.ADMIN && (
              <NotificationBell className="hidden sm:inline-flex" />
            )}

            {showMarketplaceActions && (
              <Link
                to="/wishlist"
                className="hidden rounded-xl p-2.5 text-gray-600 hover:bg-primary-50 hover:text-primary sm:inline-flex"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Link>
            )}

            {showMarketplaceActions && (
              <Link
                to="/cart"
                className="relative rounded-xl p-2.5 text-gray-600 hover:bg-primary-50 hover:text-primary"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  title={dashboardLabel}
                >
                  <User className="h-4 w-4" />
                  {user?.fullName?.split(' ')[0] || dashboardLabel}
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  to="/login"
                  className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={toggleMobileMenu}
              className="rounded-xl p-2.5 text-gray-600 hover:bg-gray-100 lg:hidden"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="h-10 w-full rounded-xl border border-primary-100 bg-primary-50/50 pl-4 pr-12 text-sm focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-primary text-white"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      <Navbar />
    </header>
  )
}
