import { Navigate, useLocation } from 'react-router-dom'
import { getAuthToken } from '../../utils/authStorage'

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
  const token = getAuthToken()
  const user = getStoredUser()

  if (!token || !isSellerRole(user?.role)) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

