import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { usersApi } from '../../services/api'
import {
  getDeliveryProfileStatus,
  isDeliveryDriverActive,
  isDeliveryProviderActive,
} from '../utils/deliveryAuth'

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
}

export default function DeliveryApprovedRoute() {
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState(getStoredUser)
  const token = localStorage.getItem('token')

  // BACKEND: GET /users/me — refresh approval status before rendering portal
  useEffect(() => {
    let cancelled = false
    usersApi
      .getProfile()
      .then((res) => {
        const profile = res.data?.data ?? res.data
        if (profile && !cancelled) {
          localStorage.setItem('user', JSON.stringify(profile))
          setUser(profile)
        }
      })
      .catch(() => {})
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

export function readDeliveryUser() {
  return getStoredUser()
}

export function refreshDeliveryUserFromStorage() {
  return getStoredUser()
}

function getDeliveryProfileLabel(user) {
  const status = getDeliveryProfileStatus(user)
  return status || 'PENDING'
}

export { getDeliveryProfileLabel }
