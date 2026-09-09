import { X } from 'lucide-react'
import SellerSidebar from './SellerSidebar'

export default function SellerMobileNav({
  open,
  onClose,
}) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <aside className="relative z-10 h-full w-72 bg-white shadow-xl">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h2 className="font-semibold text-gray-900">
            Seller Menu
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
            aria-label="Close seller menu"
          >
            <X size={21} />
          </button>
        </div>

        <SellerSidebar
          mobile
          onNavigate={onClose}
        />
      </aside>
    </div>
  )
}