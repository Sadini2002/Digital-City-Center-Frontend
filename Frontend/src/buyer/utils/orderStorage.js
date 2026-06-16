const ORDERS_KEY = 'dcc_orders'

export const ORDER_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  PAYMENT_FAILED: 'payment_failed',
  PROCESSING: 'processing',
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
        : existing.trackingStatus),
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
  { key: 'placed', label: 'Order placed', detail: 'Your order was received.' },
  { key: 'paid', label: 'Payment confirmed', detail: 'Payment has been verified.' },
  { key: 'processing', label: 'Processing', detail: 'Seller is preparing your items.' },
  { key: 'shipped', label: 'Shipped', detail: 'Package handed to delivery partner.' },
  { key: 'out_for_delivery', label: 'Out for delivery', detail: 'Courier is on the way.' },
  { key: 'delivered', label: 'Delivered', detail: 'Order delivered successfully.' },
]

export function isOrderDelivered(order) {
  const tracking = order?.trackingStatus ?? order?.status
  return tracking === 'delivered'
}

export function markOrderDelivered(orderId) {
  const order = getOrderById(orderId)
  if (!order) return null
  return updateOrderStatus(orderId, order.status ?? ORDER_STATUS.CONFIRMED, {
    trackingStatus: 'delivered',
    deliveredAt: new Date().toISOString(),
  })
}

export function getOrderProgress(order) {
  const tracking = order?.trackingStatus ?? order?.status

  const statusIndex = {
    pending_payment: 0,
    payment_failed: 0,
    placed: 0,
    confirmed: 1,
    paid: 1,
    processing: 2,
    shipped: 3,
    out_for_delivery: 4,
    delivered: 5,
  }

  const idx = statusIndex[tracking] ?? (order?.status === ORDER_STATUS.CONFIRMED ? 2 : 0)

  return ORDER_TRACKING_STEPS.map((step, i) => ({
    ...step,
    complete: i <= idx,
    current: i === idx,
  }))
}
