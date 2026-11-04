import { useCallback, useEffect, useRef, useState } from 'react'
import { adminApi } from '../../services/adminApi'

/**
 * Loads one order's full details. `setOrder` lets child components replace
 * the order with the fresh payload returned by every mutation.
 */
export default function useAdminOrder(orderId) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const requestRef = useRef(0)

  const load = useCallback(async () => {
    if (!orderId) return
    const requestId = ++requestRef.current
    setLoading(true)
    setError('')
    try {
      const res = await adminApi.getOrderById(orderId)
      if (requestId !== requestRef.current) return
      setOrder(res.data?.data ?? null)
    } catch (err) {
      if (requestId !== requestRef.current) return
      setOrder(null)
      setError(err.message || 'Failed to load order.')
    } finally {
      if (requestId === requestRef.current) setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    load()
  }, [load])

  return { order, setOrder, loading, error, reload: load }
}