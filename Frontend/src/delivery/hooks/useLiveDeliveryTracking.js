import { useCallback, useEffect, useState } from 'react'
import trackingApi from '../services/trackingApi'
import { isGpsActiveStatus } from '../utils/deliveryStatus'

const POLL_MS = 12000

/**
 * Driver portal — polls live delivery snapshot.
 *
 * BACKEND: GET /tracking/delivery/:id (Bearer token)
 * Optional: Firebase/WebSocket via RealtimeContext (see srcc/hooks/useLiveDeliveryTracking.js)
 */
export default function useLiveDeliveryTracking(deliveryId, { enableFetch = true, enablePoll = true } = {}) {
  const [tracking, setTracking] = useState(null)
  const [location, setLocation] = useState(null)
  const [route, setRoute] = useState([])
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(Boolean(deliveryId && enableFetch))

  const refresh = useCallback(async () => {
    if (!deliveryId) return
    try {
      const data = await trackingApi.getDeliveryLive(deliveryId)
      setTracking(data)
      if (data.location) setLocation(data.location)
      if (data.route) setRoute(data.route)
      setIsLive(isGpsActiveStatus(data.status))
    } catch {
      // keep last snapshot
    } finally {
      setLoading(false)
    }
  }, [deliveryId])

  useEffect(() => {
    if (!deliveryId || !enableFetch) {
      setLoading(false)
      return undefined
    }

    refresh()
    if (!enablePoll) return undefined

    const poll = setInterval(refresh, POLL_MS)
    return () => clearInterval(poll)
  }, [deliveryId, enableFetch, enablePoll, refresh])

  return { tracking, location, route, isLive, loading, refresh }
}
