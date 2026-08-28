import { api } from '../../services/api'

import {
  getOrderById,
  saveOrder,
  updateOrderStatus,
} from '../utils/orderStorage'

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

    deliveryAddress: buildDeliveryAddress(order.address),

    deliveryMethod: order.deliveryMethod,

    paymentMethod,

    notes: `Checkout order from buyer: ${order.email}`,
  }

  /*
   * Create the real order in the backend.
   */
  const response = await api.post('/orders/checkout', payload)

  const backendOrder = response?.data?.data

  if (!backendOrder?.orderId) {
    throw new Error('Backend did not return an order ID.')
  }

  /*
   * Keep a frontend snapshot for the existing
   * success/tracking pages.
   *
   * The actual order is stored in PostgreSQL.
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
   * --------------------------------------------------
   * CASH ON DELIVERY
   * --------------------------------------------------
   *
   * The order is already created in the backend.
   * Trigger the backend payment webhook so the
   * notification service can create the relevant
   * notification.
   */
  if (paymentMethod === 'COD') {
    try {
      await api.post('/payments/webhook', {
        gateway: 'cod',
        order_id: backendOrder.orderId,
        status_code: 2,
        amount:
          backendOrder.totalAmount ??
          order.total ??
          0,
        payment_method: 'cod',
      })

      console.info(
        '[DCC] COD payment notification processed for order',
        backendOrder.orderNumber,
      )
    } catch (error) {
      /*
       * Do not break checkout if notification/payment
       * notification processing fails.
       */
      console.error(
        '[DCC] Failed to process COD notification:',
        error,
      )
    }

    await sendConfirmationEmail(savedOrder)

    return {
      order: savedOrder,
      requiresGateway: false,
      gatewayUrl: null,
    }
  }

  /*
   * --------------------------------------------------
   * ONLINE PAYMENT
   * --------------------------------------------------
   *
   * Store the REAL backend order ID because the payment
   * webhook needs to update the PostgreSQL order.
   */
  if (isOnlinePayment(order.paymentMethod)) {
    sessionStorage.setItem(
      PENDING_CART_KEY,
      String(backendOrder.orderId),
    )

    return {
      order: savedOrder,
      requiresGateway: true,
      gatewayUrl: `/payment/gateway/${backendOrder.orderId}`,
    }
  }

  /*
   * Fallback
   */
  return {
    order: savedOrder,
    requiresGateway: false,
    gatewayUrl: null,
  }
}

/**
 * Process the payment result from the simulated
 * payment gateway.
 *
 * This calls the REAL backend payment webhook.
 *
 * Backend:
 * POST /api/v1/payments/webhook
 */
export async function processPaymentWebhook(
  orderId,
  { success },
) {
  const order = getOrderById(orderId)

  if (!order) {
    throw new Error('Order not found.')
  }

  try {
    /*
     * Call backend payment webhook.
     *
     * The backend is responsible for:
     * - Updating payment status
     * - Updating order status
     * - Creating payment notification
     * - Creating order confirmation notification
     */
    const response = await api.post(
      '/payments/webhook',
      {
        gateway:
          order.paymentMethod ||
          'unknown',

        order_id:
          order.backendOrderId ||
          order.id,

        status_code:
          success ? 2 : 0,

        amount:
          Number(order.total || 0),

        payment_method:
          order.paymentMethod ||
          null,
      },
    )

    console.info(
      '[DCC] Payment webhook processed:',
      response.data,
    )

    /*
     * Update the existing frontend order snapshot
     * so the success/failure pages continue to work.
     */
    const nextStatus = success
      ? 'confirmed'
      : 'payment_failed'

    const updated = updateOrderStatus(
      orderId,
      nextStatus,
      {
        paymentConfirmedAt: success
          ? new Date().toISOString()
          : null,

        trackingStatus: success
          ? 'processing'
          : undefined,

        emailSent: success,
      },
    )

    /*
     * The actual notification is created by the backend.
     *
     * This console message only represents the existing
     * frontend email simulation.
     */
    if (success) {
      await sendConfirmationEmail(updated)
    }

    sessionStorage.removeItem(
      PENDING_CART_KEY,
    )

    return updated
  } catch (error) {
    console.error(
      '[DCC] Payment webhook failed:',
      error,
    )

    throw error
  }
}

/**
 * Get the currently pending backend order ID.
 */
export function getPendingCartOrderId() {
  return sessionStorage.getItem(
    PENDING_CART_KEY,
  )
}

/**
 * Clear the pending payment order.
 */
export function clearPendingCartFlag() {
  sessionStorage.removeItem(
    PENDING_CART_KEY,
  )
}

/**
 * Current project uses a simulated confirmation email.
 *
 * This does NOT create the website notification.
 * The backend payment webhook creates the notification.
 */
async function sendConfirmationEmail(order) {
  await new Promise((resolve) =>
    setTimeout(resolve, 200),
  )

  console.info(
    '[DCC] Confirmation email sent to',
    order.email,
    'for order',
    order.orderNumber ||
      order.id,
  )

  return {
    sent: true,
    to: order.email,
  }
}