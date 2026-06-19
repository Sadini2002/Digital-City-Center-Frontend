import { Navigate, Outlet } from 'react-router-dom'

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
}

/** Fleet management — delivery company owners only */
export default function DeliveryProviderOnlyRoute() {
  const user = getStoredUser()
  if (user?.role !== 'DELIVERY_PROVIDER') {
    return <Navigate to="/delivery" replace />
  }
  return <Outlet />
}
