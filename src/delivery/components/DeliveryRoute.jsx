/** BACKEND: Requires valid JWT; role DELIVERY_PROVIDER | DELIVERY_DRIVER from /users/me */
import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { usersApi } from '../../services/api'
import { isDeliveryRole } from '../utils/deliveryAuth'
import { getAuthToken } from '../../utils/authStorage'

export default function DeliveryRoute({ children }) {
  const location = useLocation()
  const token = getAuthToken()
  const [checking, setChecking] = useState(Boolean(token))
  const [user, setUser] = useState(null)

  useEffect(() => {
    let cancelled = false

    if (!token) {
      setChecking(false)
      return undefined
    }

    usersApi
      .getProfile()
      .then((res) => {
        const profile = res.data?.data ?? res.data
        if (!cancelled) {
          setUser(profile || null)
          if (profile) {
            localStorage.setItem('user', JSON.stringify(profile))
          }
        }
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })

    return () => {
      cancelled = true
    }
  }, [token])

  if (checking) {
    return <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">Loading delivery portal…</div>
  }

  if (!token || !isDeliveryRole(user?.role)) {
    return <Navigate to="/login?portal=delivery" replace state={{ from: location.pathname }} />
  }

  return children
}
