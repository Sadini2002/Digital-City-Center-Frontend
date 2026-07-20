import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { usersApi } from '../../services/api'
import {
  isDeliveryDriverActive,
  isDeliveryProviderActive,
  isDemoDelivery,
  getStoredDeliveryUser,
} from '../utils/deliveryAuth'
import { getAuthToken } from '../../utils/authStorage'

export default function DeliveryApprovedRoute() {
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState(null)
  const token = getAuthToken()

  // BACKEND: GET /users/me — refresh approval status before rendering portal
  useEffect(() => {
    let cancelled = false

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
        if (profile && !cancelled) {
          localStorage.setItem('user', JSON.stringify(profile))
          setUser(profile)
        }
      })
      .catch(() => {
        // Fall back to stored user on API errors
        if (!cancelled) setUser(getStoredDeliveryUser())
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (checking) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Loading delivery portal…
      </div>
    )
  }

  if (!token) return <Navigate to="/login?portal=delivery" replace />

  const isProvider = user?.role === 'DELIVERY_PROVIDER'
  const isDriver = user?.role === 'DELIVERY_DRIVER'

  if (!isProvider && !isDriver) {
    return <Navigate to="/" replace />
  }

  if (isProvider) {
    if (!user?.deliveryProvider) return <Navigate to="/register/delivery" replace />
    if (!isDeliveryProviderActive(user)) {
      return <Navigate to="/delivery/application-status" replace />
    }
  }

  if (isDriver) {
    if (!user?.deliveryDriver) return <Navigate to="/login?portal=delivery" replace />
    if (!isDeliveryDriverActive(user)) {
      return <Navigate to="/delivery/application-status" replace />
    }
  }

  return <Outlet />
}
