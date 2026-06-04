import { useEffect, useRef, useState } from 'react'
import deliveryApi from '../services/deliveryApi'
import trackingApi from '../services/trackingApi'
import { isActiveStatus, isGpsActiveStatus } from '../utils/deliveryStatus'

const POLL_MS = 15000

/**
 * Generic live delivery hook (buyer order detail, admin widgets, etc.).
 *
 * BACKEND:
 *   - Poll: GET /tracking/delivery/:deliveryId or GET /delivery/deliveries/:id
 *   - GPS upload (driver only): POST /delivery/deliveries/:id/tracking/batch when enableGps=true
 *   - Realtime: Firebase (srcc) — replace polling when RealtimeContext is added
 */
export default function useRealtimeDelivery(deliveryId, { enableGps = false, poll = true } = {}) {
  const [liveDelivery, setLiveDelivery] = useState(null)
  const [location, setLocation] = useState(null)
  const [route, setRoute] = useState([])
  const [isLive, setIsLive] = useState(false)
  const watchRef = useRef(null)

  const refreshFromApi = async () => {
    if (!deliveryId) return
    try {
      const data = await trackingApi.getDeliveryLive(deliveryId)
      setLiveDelivery(data)
      if (data.location) setLocation(data.location)
      if (data.route) setRoute(data.route)
      setIsLive(isGpsActiveStatus(data.status))
    } catch {
      // keep last snapshot
    }
  }

  useEffect(() => {
    if (!deliveryId) return undefined
    refreshFromApi()
    if (!poll) return undefined
    const id = setInterval(refreshFromApi, POLL_MS)
    return () => clearInterval(id)
  }, [deliveryId, poll])

  useEffect(() => {
    if (!enableGps || !deliveryId || !liveDelivery) return undefined
    const active = isActiveStatus(liveDelivery.status)
    if (!active || !navigator.geolocation) return undefined

    const buffer = []
    let flushTimer = null
    const flush = () => {
      if (!buffer.length) return
      const points = buffer.splice(0, buffer.length)
      deliveryApi.addTrackingBatch(deliveryId, points).catch(() => buffer.unshift(...points))
    }

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        buffer.push({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading ?? undefined,
          speed: pos.coords.speed ?? undefined,
        })
        if (buffer.length >= 10) flush()
        if (!flushTimer) flushTimer = setInterval(flush, 8000)
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000 }
    )

    return () => {
      if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current)
      if (flushTimer) clearInterval(flushTimer)
      flush()
    }
  }, [deliveryId, enableGps, liveDelivery?.status])

  return { liveDelivery, location, route, isLive, refreshFromApi }
}
