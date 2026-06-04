/** BACKEND: Requires valid JWT; role DELIVERY_PROVIDER | DELIVERY_DRIVER from login */
import { Navigate, useLocation } from 'react-router-dom'
import { isDeliveryRole } from '../utils/deliveryAuth'

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
}

export default function DeliveryRoute({ children }) {
  const location = useLocation()
  const token = localStorage.getItem('token')
  const user = getStoredUser()

  if (!token || !isDeliveryRole(user?.role)) {
    return <Navigate to="/login?portal=delivery" replace state={{ from: location.pathname }} />
  }

  return children
}
