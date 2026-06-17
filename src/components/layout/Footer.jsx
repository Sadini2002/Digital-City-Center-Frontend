import { useLocation } from 'react-router-dom'
import FooterAuth from './FooterAuth'
import FooterDefault from './FooterDefault'
import FooterMarketplace from './FooterMarketplace'

const AUTH_FOOTER_PATHS = ['/login', '/register', '/register/seller']

function isMarketplaceFooter(pathname) {
  if (pathname === '/about' || pathname === '/contact') return true
  if (pathname === '/categories' || pathname.startsWith('/categories/')) return true
  if (pathname === '/shops' || pathname.startsWith('/shops/')) return true
  return false
}

/** @deprecated Use pathname checks in Footer — kept for tests/imports */
export function useMarketplaceFooter() {
  const { pathname } = useLocation()
  return isMarketplaceFooter(pathname)
}

export function useAuthFooter() {
  const { pathname } = useLocation()
  return AUTH_FOOTER_PATHS.includes(pathname)
}

export default function Footer() {
  const { pathname } = useLocation()

  if (AUTH_FOOTER_PATHS.includes(pathname)) {
    return <FooterAuth />
  }
  if (isMarketplaceFooter(pathname)) {
    return <FooterMarketplace />
  }
  return <FooterDefault />
}
