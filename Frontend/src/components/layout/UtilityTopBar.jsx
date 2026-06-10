import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

export default function UtilityTopBar() {
  return (
    <div className="bg-dcc-topbar text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:px-6 lg:px-8">
        <p className="hidden min-w-0 truncate text-xs font-medium text-white sm:block sm:text-[13px]">
          Welcome to Digital City Center - Your All-in-One Marketplace in Sri Lanka!
        </p>

        <div className="flex w-full min-w-0 items-center justify-end gap-3 overflow-x-auto text-xs font-medium [-ms-overflow-style:none] [scrollbar-width:none] sm:w-auto sm:gap-5 sm:text-[13px] [&::-webkit-scrollbar]:hidden">
          <Link to="/track" className="shrink-0 whitespace-nowrap hover:text-white/80">
            Track Delivery
          </Link>
          <Link to="/help" className="shrink-0 whitespace-nowrap hover:text-white/80">
            Help Center
          </Link>
          <span className="hidden h-3.5 w-px shrink-0 bg-white/40 sm:block" aria-hidden />
          <Link
            to="/register/seller"
            className="hidden shrink-0 whitespace-nowrap hover:text-white/80 xs:inline"
          >
            Sell on DCC
          </Link>
          <Link
            to="/login?portal=delivery"
            className="hidden shrink-0 whitespace-nowrap hover:text-white/80 xs:inline"
          >
            Delivery Partners
          </Link>
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 whitespace-nowrap hover:text-white/80"
            aria-label="Select language"
          >
            English
            <ChevronDown className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  )
}
