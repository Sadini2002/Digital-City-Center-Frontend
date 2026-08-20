import { isOnlinePayment } from '../data/checkoutData'
import {
  getOrderById,
  saveOrder,
  updateOrderStatus,
} from '../utils/orderStorage'
import { api } from '../../services/api/client'

const PENDING_CART_KEY = 'dcc_pending_cart_order'

/**
 * Create a local checkout order.
 *
 * The current DCC frontend uses local order storage for the checkout UI.
 * Backend payment notifications are triggered when the payment is
 * confirmed through processPaymentWebhook().
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

  /*
   * Cash on Delivery
   *
   * There is no online payment gateway for COD, so we notify the backend
   * immediately that the order/payment step was successfully completed.
   */
  if (!online) {
    try {
      await api.post('/payments/webhook', {
        gateway: 'cod',
        order_id: order.id,
        status_code: 2,
        amount: order.total,
        payment_method: 'cod',
      })

      console.info(
        '[DCC] COD order notification sent for order',
        order.id,
      )
    } catch (error) {
      /*
       * Do not stop checkout if notification creation fails.
       * The order has already been saved locally.
       */
      console.error(
        '[DCC] Failed to create COD notification:',
        error,
      )
    }

    await sendConfirmationEmail(pending)

    return {
      order: pending,
      requiresGateway: false,
      gatewayUrl: null,
    }
  }

  /*
   * Online payment
   *
   * The current project uses a simulated gateway page.
   */
  sessionStorage.setItem(PENDING_CART_KEY, order.id)

  return {
    order: pending,
    requiresGateway: true,
    gatewayUrl: `/payment/gateway/${order.id}`,
  }
}

/**
 * Simulated gateway webhook.
 *
 * This calls the actual backend payment webhook instead of only
 * updating localStorage.
 *
 * Backend:
 * POST /api/v1/payments/webhook
 */
export async function processPaymentWebhook(orderId, { success }) {
  const order = getOrderById(orderId)

  if (!order) {
    throw new Error('Order not found')
  }

  if (order.status !== 'pending_payment') {
    return order
  }

  try {
    const response = await api.post('/payments/webhook', {
      gateway: order.paymentMethod || 'unknown',
      order_id: order.id,
      status_code: success ? 2 : 0,
      amount: Number(order.total || 0),
      payment_method: order.paymentMethod || null,
    })

    console.info(
      '[DCC] Payment webhook processed:',
      response.data,
    )
  } catch (error) {
    console.error(
      '[DCC] Payment webhook failed:',
      error,
    )

    throw error
  }

  /*
   * Keep the existing frontend order experience working.
   */
  const nextStatus = success
    ? 'confirmed'
    : 'payment_failed'

  const updated = updateOrderStatus(orderId, nextStatus, {
    paymentConfirmedAt: success
      ? new Date().toISOString()
      : null,

    trackingStatus: success
      ? 'processing'
      : undefined,

    emailSent: success,
  })

  /*
   * The backend now creates the real website notification.
   *
   * This console message is kept only because the current project
   * displays the confirmation email as part of the simulated flow.
   */
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

/**
 * Current project uses a simulated confirmation email.
 *
 * This does NOT create the notification.
 * The backend payment webhook creates the actual notification.
 */
async function sendConfirmationEmail(order) {
  await new Promise((resolve) => setTimeout(resolve, 200))

  console.info(
    '[DCC] Confirmation email sent to',
    order.email,
    'for order',
    order.id,
  )

  return {
    sent: true,
    to: order.email,
  }
}