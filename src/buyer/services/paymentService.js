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

    deliveryAddress:
      buildDeliveryAddress(order.address),

    deliveryMethod:
      order.deliveryMethod,

    paymentMethod,

    notes:
      `Checkout order from buyer: ${order.email}`,
  }

  const response = await api.post('/orders/checkout', payload)

  const backendOrder = response?.data

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

    return {
      order: savedOrder,
      orderId: backendOrder.orderId,
      requiresGateway: true,
      gatewayUrl: `/payment/gateway/${backendOrder.orderId}`,
    }
  }

  return {
    order: savedOrder,
    orderId: backendOrder.orderId,
    requiresGateway: false,
    gatewayUrl: null,
  }
}


/**
 * Temporary gateway simulation.
 *
 * Later this should call the real payment backend/webhook.
 */
export async function processPaymentWebhook(
  orderId,
  { success },
) {
  await new Promise((resolve) =>
    setTimeout(resolve, 600),
  )

  const order = getOrderById(
    String(orderId),
  )

  if (!order) {
    throw new Error('Order not found.')
  }

  const nextStatus = success
    ? 'confirmed'
    : 'payment_failed'

  const updated = updateOrderStatus(
    String(orderId),
    nextStatus,
    {
      paymentConfirmedAt: success
        ? new Date().toISOString()
        : null,

      trackingStatus: success
        ? 'processing'
        : undefined,
    },
  )

  sessionStorage.removeItem(
    PENDING_CART_KEY,
  )

  return updated
}

export function getPendingCartOrderId() {
  return sessionStorage.getItem(
    PENDING_CART_KEY,
  )
}

export function clearPendingCartFlag() {
  sessionStorage.removeItem(
    PENDING_CART_KEY,
  )
}