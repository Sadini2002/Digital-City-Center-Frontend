import { Navigate, useLocation } from 'react-router-dom'
import { getAuthToken } from '../../utils/authStorage'

function isLoggedIn() {
  return Boolean(getAuthToken())
}

export default function BuyerRoute({ children }) {
  const location = useLocation()

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
