const ORDERS_KEY = 'dcc_orders'

export const ORDER_STATUS = {
  PLACED: 'placed',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  DISPATCHED: 'dispatched',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  PAYMENT_FAILED: 'payment_failed',
  REJECTED: 'rejected',
  // Backward compatibility aliases
  PENDING_PAYMENT: 'pending_payment',
  SHIPPED: 'dispatched',
}

export function saveOrder(order) {
  const list = getOrders()
  const without = list.filter((o) => o.id !== order.id)
  const next = [order, ...without]
  localStorage.setItem(ORDERS_KEY, JSON.stringify(next))
  sessionStorage.setItem('dcc_last_order', JSON.stringify(order))
}

export function updateOrderStatus(orderId, status, extra = {}) {
  const list = getOrders()
  const index = list.findIndex((o) => o.id === orderId)
  const existing = index >= 0 ? list[index] : getOrderById(orderId)

  if (!existing) return null

  const updated = {
    ...existing,
    ...extra,
    status,
    trackingStatus:
      extra.trackingStatus ??
      (status === ORDER_STATUS.CONFIRMED && !existing.trackingStatus
        ? 'processing'
        : existing.trackingStatus || status),
    updatedAt: new Date().toISOString(),
  }

  if (index >= 0) {
    list[index] = updated
  } else {
    list.unshift(updated)
  }

  localStorage.setItem(ORDERS_KEY, JSON.stringify(list))
  sessionStorage.setItem('dcc_last_order', JSON.stringify(updated))
  return updated
}

export function getOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getOrderById(id) {
  const fromList = getOrders().find((o) => o.id === id)
  if (fromList) return fromList

  try {
    const raw = sessionStorage.getItem('dcc_last_order')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed.id === id ? parsed : null
  } catch {
    return null
  }
}

export const ORDER_TRACKING_STEPS = [
  { key: 'placed', label: 'Order Placed', detail: 'Order received and recorded in system.' },
  { key: 'confirmed', label: 'Confirmed', detail: 'Payment verified and seller accepted.' },
  { key: 'processing', label: 'Processing', detail: 'Seller is preparing and packaging items.' },
  { key: 'dispatched', label: 'Dispatched', detail: 'Package handed over for delivery.' },
  { key: 'out_for_delivery', label: 'Out for Delivery', detail: 'Courier is delivering your package.' },
  { key: 'delivered', label: 'Delivered', detail: 'Order successfully delivered to customer.' },
]

export function isOrderDelivered(order) {
  const tracking = order?.trackingStatus ?? order?.status
  return tracking === 'delivered' || tracking === 'completed'
}

export function markOrderDelivered(orderId) {
  const order = getOrderById(orderId)
  if (!order) return null
  return updateOrderStatus(orderId, ORDER_STATUS.DELIVERED, {
    trackingStatus: 'delivered',
    deliveredAt: new Date().toISOString(),
  })
}

export function getOrderProgress(order) {
  const tracking = order?.trackingStatus ?? order?.status

  const statusIndex = {
    placed: 0,
    pending_payment: 0,
    payment_failed: 0,
    confirmed: 1,
    paid: 1,
    processing: 2,
    dispatched: 3,
    shipped: 3,
    out_for_delivery: 4,
    delivered: 5,
    completed: 5,
  }

  const idx = statusIndex[tracking] ?? (order?.status === ORDER_STATUS.CONFIRMED ? 1 : 0)

  return ORDER_TRACKING_STEPS.map((step, i) => ({
    ...step,
    complete: i <= idx,
    current: i === idx,
  }))
}
