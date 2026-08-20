import { api } from '../../services/api'
import {
  getOrderById,
  saveOrder,
  updateOrderStatus,
} from '../utils/orderStorage'
import { api } from '../../services/api/client'
import { isOnlinePayment } from '../data/checkoutData'

const PENDING_CART_KEY = 'dcc_pending_cart_order'

function buildDeliveryAddress(address) {
  return [
    address?.name,
    address?.phone,
    address?.line1,
    address?.line2,
    address?.city,
    address?.district,
    address?.postalCode,
  ]
    .filter(Boolean)
    .join(', ')
}

/**
 * Create a REAL order using the backend.
 */
export async function placeOrder(order) {
  const paymentMethod =
    order.paymentMethod === 'cod'
      ? 'COD'
      : order.paymentMethod === 'payhere'
        ? 'PAYHERE'
        : null

  if (!paymentMethod) {
    throw new Error(
      'This payment method is not connected to the backend yet. Please use Cash on Delivery or PayHere.',
    )
  }

  const items = order.items.map((item) => {
    const variantId = Number(item.variantId)

    if (!Number.isInteger(variantId) || variantId <= 0) {
      throw new Error(
        `${item.name || 'A cart item'} does not have a valid product variant.`,
      )
    }

    return {
      variantId,
      quantity: Number(item.quantity) || 1,
    }
  })

  const payload = {
    items,

    deliveryAddress:
      buildDeliveryAddress(order.address),

    deliveryMethod:
      order.deliveryMethod,

    paymentMethod,

    notes:
      `Checkout order from buyer: ${order.email}`,
  }

  const response = await api.post('/orders/checkout', payload)

  const backendOrder = response?.data?.data

  if (!backendOrder?.orderId) {
    throw new Error('Backend did not return an order ID.')
  }

  /*
   * Keep a frontend snapshot for the existing success/tracking pages.
   * The actual order is now stored in PostgreSQL.
   */
  const savedOrder = {
    ...order,

    id: String(backendOrder.orderId),

    orderNumber: backendOrder.orderNumber,

    subtotal:
      backendOrder.subtotal ??
      order.subtotal,

    deliveryFee:
      backendOrder.deliveryFee ??
      order.deliveryFee,

    total:
      backendOrder.totalAmount ??
      order.total,

    paymentMethod: order.paymentMethod,

    paymentStatus:
      backendOrder.paymentStatus,

    status:
      paymentMethod === 'COD'
        ? 'confirmed'
        : 'pending_payment',

    trackingStatus:
      paymentMethod === 'COD'
        ? 'processing'
        : undefined,

    backendOrderId:
      backendOrder.orderId,
  }

  saveOrder(savedOrder)

  /*
   * Online payment goes to the gateway after
   * the real backend order is created.
   */
  if (isOnlinePayment(order.paymentMethod)) {
    sessionStorage.setItem(
      PENDING_CART_KEY,
      String(backendOrder.orderId),
    )

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
    throw new Error('Order not found.')
  }

  const nextStatus = success
    ? 'confirmed'
    : 'payment_failed'

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
  return sessionStorage.getItem(
    PENDING_CART_KEY,
  )
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
}}