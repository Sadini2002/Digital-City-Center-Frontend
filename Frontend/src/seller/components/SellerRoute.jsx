import { Navigate, useLocation } from 'react-router-dom'

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
}

function isSellerRole(role) {
  return String(role ?? '').toUpperCase() === 'SELLER'
}

export default function SellerRoute({ children }) {
  const location = useLocation()
  const token = localStorage.getItem('token')
  const user = getStoredUser()

  if (!token || !isSellerRole(user?.role)) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

