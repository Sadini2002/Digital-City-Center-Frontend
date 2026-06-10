import { Navigate, useLocation } from 'react-router-dom'
import { canAdminAccessPath, getAdminRedirectPath, isAdminRole, normalizeAdminRole } from '../utils/adminRole'
import { getAdminToken } from '../../utils/authStorage'

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('admin_user') || '{}')
  } catch {
    return {}
  }
}

export default function AdminRoute({ children }) {
  const location = useLocation()
  const token = getAdminToken()
  const user = getStoredUser()
  const normalizedRole = normalizeAdminRole(user?.role)

  if (!token || !isAdminRole(user?.role) || !normalizedRole) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  if (!canAdminAccessPath(normalizedRole, location.pathname)) {
    return <Navigate to={getAdminRedirectPath(normalizedRole)} replace />
  }

  return children
}

