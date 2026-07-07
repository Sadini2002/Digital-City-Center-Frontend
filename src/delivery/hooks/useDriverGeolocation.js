import { useEffect, useRef } from 'react'
import { deliveryApi } from '../services/deliveryApi'

const BATCH_INTERVAL_MS = 8000
const MAX_BUFFER = 15

/**
 * Driver device GPS → server batches.
 */
export default function useDriverGeolocation(deliveryId, { enabled = false, active = true } = {}) {
  const bufferRef = useRef([])
  const watchRef = useRef(null)
  const intervalRef = useRef(null)

  const flush = async () => {
    if (!deliveryId || bufferRef.current.length === 0) return
    const points = bufferRef.current.splice(0, bufferRef.current.length)
    try {
      await deliveryApi.addTrackingBatch(deliveryId, points)
    } catch {
      bufferRef.current.unshift(...points)
    }
  }

  useEffect(() => {
    if (!enabled || !active || !deliveryId || !navigator.geolocation) {
      return undefined
    }

    intervalRef.current = setInterval(flush, BATCH_INTERVAL_MS)

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        bufferRef.current.push({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading ?? undefined,
          speed: pos.coords.speed ?? undefined,
        })
        if (bufferRef.current.length >= MAX_BUFFER) flush()
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    )

    return () => {
      if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
      flush()
    }
  }, [deliveryId, enabled, active])
}
