import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/categories', label: 'Categories' },
  { to: '/shops', label: 'Shops' },
  { to: '/deals', label: 'Deals', badge: 'HOT' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
]

const linkClass = ({ isActive }) =>
  cn(
    'pb-3 text-sm font-medium transition-colors',
    isActive ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-primary',
  )

export default function Navbar() {
  return (
    <nav className="border-t border-gray-100 bg-white">
      <div className="container-dcc flex items-center gap-6 overflow-x-auto py-0">
        {navItems.map(({ to, label, end, badge }) => (
          <NavLink key={to} to={to} end={end} className={linkClass}>
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              {label}
              {badge && (
                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  {badge}
                </span>
              )}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
