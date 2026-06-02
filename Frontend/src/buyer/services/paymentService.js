import { isOnlinePayment } from '../data/checkoutData'
import {
  getOrderById,
  saveOrder,
  updateOrderStatus,
} from '../utils/orderStorage'

const PENDING_CART_KEY = 'dcc_pending_cart_order'

/**
 * Step 8–9: Create order awaiting payment (online) or confirm immediately (COD).
 */
export async function placeOrder(order) {
  const online = isOnlinePayment(order.paymentMethod)

  const pending = {
    ...order,
    status: online ? 'pending_payment' : 'confirmed',
    trackingStatus: online ? undefined : 'processing',
    emailSent: !online,
    paymentConfirmedAt: online ? null : new Date().toISOString(),
  }

  saveOrder(pending)

  if (online) {
    sessionStorage.setItem(PENDING_CART_KEY, order.id)
    return {
      order: pending,
      requiresGateway: true,
      gatewayUrl: `/payment/gateway/${order.id}`,
    }
  }

  await sendConfirmationEmail(pending)
  return {
    order: pending,
    requiresGateway: false,
    gatewayUrl: null,
  }
}

/**
 * Step 12–13: Simulates gateway webhook → backend updates order status.
 */
export async function processPaymentWebhook(orderId, { success }) {
  await new Promise((r) => setTimeout(r, 600))

  const order = getOrderById(orderId)
  if (!order) {
    throw new Error('Order not found')
  }

  if (order.status !== 'pending_payment') {
    return order
  }

  const nextStatus = success ? 'confirmed' : 'payment_failed'
  const updated = updateOrderStatus(orderId, nextStatus, {
    paymentConfirmedAt: success ? new Date().toISOString() : null,
    trackingStatus: success ? 'processing' : undefined,
    emailSent: success,
  })

  if (success) {
    await sendConfirmationEmail(updated)
  }

  sessionStorage.removeItem(PENDING_CART_KEY)
  return updated
}

export function getPendingCartOrderId() {
  return sessionStorage.getItem(PENDING_CART_KEY)
}

export function clearPendingCartFlag() {
  sessionStorage.removeItem(PENDING_CART_KEY)
}

/** Simulates automatic confirmation email (step 15). */
async function sendConfirmationEmail(order) {
  await new Promise((r) => setTimeout(r, 200))
  console.info('[DCC] Confirmation email sent to', order.email, 'for order', order.id)
  return { sent: true, to: order.email }
}
