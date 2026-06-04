import { useCallback, useEffect, useState } from 'react'
import trackingApi from '../services/trackingApi'
import { isGpsActiveStatus } from '../utils/deliveryStatus'

const POLL_MS = 15000

/**
 * Buyer order tracking — polls order-level delivery snapshot.
 *
 * BACKEND: GET /tracking/order/:orderId
 * Response should include { delivery, trackingCode, location?, route?, timeline? }
 *
 * Optional upgrade: Firebase subscribe on order path (see srcc firebaseService).
 */
export default function useOrderLiveTracking(orderId, { enabled = true, poll = true } = {}) {
  const [snapshot, setSnapshot] = useState(null)
  const [loading, setLoading] = useState(Boolean(orderId && enabled))
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!orderId || !enabled) return
    try {
      const data = await trackingApi.getOrderLive(orderId)
      setSnapshot(data)
      setError(null)
    } catch (err) {
      setError(err.message || 'Unable to load delivery tracking')
    } finally {
      setLoading(false)
    }
  }, [orderId, enabled])

  useEffect(() => {
    if (!orderId || !enabled) {
      setLoading(false)
      return undefined
    }
    setLoading(true)
    refresh()
    if (!poll) return undefined
    const id = setInterval(refresh, POLL_MS)
    return () => clearInterval(id)
  }, [orderId, enabled, poll, refresh])

  const delivery = snapshot?.delivery ?? null
  const location = delivery?.location ?? snapshot?.location ?? null
  const route = delivery?.route ?? snapshot?.route ?? []
  const isLive = delivery && isGpsActiveStatus(delivery.status)

  return {
    snapshot,
    delivery,
    trackingCode: snapshot?.trackingCode ?? delivery?.trackingCode,
    location,
    route,
    isLive,
    loading,
    error,
    refresh,
  }
}
