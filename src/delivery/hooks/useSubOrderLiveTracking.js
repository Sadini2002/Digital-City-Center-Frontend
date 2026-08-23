import { useCallback, useEffect, useState } from 'react'
import trackingApi from '../services/trackingApi'
import { isGpsActiveStatus } from '../utils/deliveryStatus'

const POLL_MS = 15000

/**
 * Per-seller sub-order tracking (multi-vendor checkout).
 *
 * BACKEND: GET /tracking/sub-order/:subOrderId
 */
export default function useSubOrderLiveTracking(subOrderId, { enabled = true, poll = true } = {}) {
  const [snapshot, setSnapshot] = useState(null)
  const [loading, setLoading] = useState(Boolean(subOrderId && enabled))
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!subOrderId || !enabled) return
    try {
      const data = await trackingApi.getSubOrderLive(subOrderId)
      setSnapshot(data)
      setError(null)
    } catch (err) {
      setError(err.message || 'Unable to load sub-order tracking')
    } finally {
      setLoading(false)
    }
  }, [subOrderId, enabled])

  useEffect(() => {
    if (!subOrderId || !enabled) {
      setLoading(false)
      return undefined
    }
    setLoading(true)
    refresh()
    if (!poll) return undefined
    const id = setInterval(refresh, POLL_MS)
    return () => clearInterval(id)
  }, [subOrderId, enabled, poll, refresh])

  const delivery = snapshot?.delivery ?? null

  return {
    snapshot,
    subOrder: snapshot?.subOrder,
    delivery,
    trackingCode: snapshot?.trackingCode ?? delivery?.trackingCode,
    location: delivery?.location,
    route: delivery?.route ?? [],
    isLive: delivery && isGpsActiveStatus(delivery.status),
    loading,
    error,
    refresh,
  }
}
