/** BACKEND: Requires valid JWT; role DELIVERY_PROVIDER | DELIVERY_DRIVER from /users/me */
import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { usersApi } from '../../services/api'
import { isDeliveryRole, isDemoDelivery, getStoredDeliveryUser } from '../utils/deliveryAuth'
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

    // Demo tokens: skip the real API, use localStorage user directly
    if (isDemoDelivery()) {
      const stored = getStoredDeliveryUser()
      if (!cancelled) setUser(stored)
      if (!cancelled) setChecking(false)
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
        // Fall back to stored user (covers demo and transient network errors)
        if (!cancelled) setUser(getStoredDeliveryUser())
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
