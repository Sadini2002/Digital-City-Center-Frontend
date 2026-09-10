
import { Menu } from 'lucide-react'
import NotificationBell from './NotificationBell'

export default function SellerHeader({
  onMenuClick,
  user,
}) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
          aria-label="Open seller menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Seller Portal
          </h1>

          <p className="hidden text-xs text-gray-500 sm:block">
            Manage your shop
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        {/* ONLY ONE NOTIFICATION BELL */}
        <NotificationBell />

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-gray-900">
            {user?.name || 'Seller'}
          </p>

          <p className="text-xs text-gray-500">
            {user?.email || ''}
          </p>
        </div>
      </div>
    </header>
  )
}

