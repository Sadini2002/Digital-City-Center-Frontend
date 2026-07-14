import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { usersApi } from '../../services/api'
import { isDemoDelivery, getStoredDeliveryUser } from '../utils/deliveryAuth'

/** Fleet management — delivery company owners only */
export default function DeliveryProviderOnlyRoute() {
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    let cancelled = false

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
        if (!cancelled) setUser(profile || null)
      })
      .catch(() => {
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
    return <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">Loading delivery portal…</div>
  }

  if (user?.role !== 'DELIVERY_PROVIDER') {
    return <Navigate to="/delivery" replace />
  }
  return <Outlet />
}
