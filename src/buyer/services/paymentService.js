import { isOnlinePayment } from '../data/checkoutData'
import {
  getOrderById,
  saveOrder,
  updateOrderStatus,
} from '../utils/orderStorage'

const PENDING_CART_KEY = 'dcc_pending_cart_order'

import { ordersApi, paymentsApi } from '../../services/api/endpoints'

/**
 * Creates the order in the backend, then initiates payment.
 */
export async function placeOrder(order) {
  const online = isOnlinePayment(order.paymentMethod)
  let backendOrderId = order.id

  const initialStatus = online ? 'pending_payment' : 'confirmed'
  let fullOrder = {
    ...order,
    status: initialStatus,
    placedAt: order.placedAt || new Date().toISOString(),
  }

  // 1. Try backend API checkout if available
  try {
    const checkoutPayload = {
      deliveryAddress: `${order.address.line1 || ''}, ${order.address.city || ''}, ${order.address.district || ''}`,
      notes: order.notes || ''
    }
    const orderRes = await ordersApi.checkout(checkoutPayload)
    if (orderRes?.data?.orderId || orderRes?.data?.order?.id) {
      backendOrderId = orderRes.data.orderId || orderRes.data.order.id
      fullOrder = { ...fullOrder, id: backendOrderId }
    }
  } catch (err) {
    console.warn('[DCC PaymentService] Backend checkout API unavailable, using generated order ID:', backendOrderId, err?.message)
  }

  // CRITICAL FIX: Save order locally so getOrderById works on success/gateway/tracking screens
  saveOrder(fullOrder)

  // 2. Initiate Payment (Online gateways or COD)
  if (online) {
    sessionStorage.setItem(PENDING_CART_KEY, backendOrderId)
    
    try {
      const initRes = await paymentsApi.initiate({
        orderId: backendOrderId,
        method: order.paymentMethod.toUpperCase(),
      })
      const paymentData = initRes.data

      if (paymentData?.checkoutParams) {
        return {
          order: fullOrder,
          requiresGateway: true,
          checkoutParams: paymentData.checkoutParams,
        }
      }

      if (paymentData?.gatewayUrl) {
        return {
          order: fullOrder,
          requiresGateway: true,
          gatewayUrl: paymentData.gatewayUrl,
        }
      }
    } catch (err) {
      console.warn('[DCC PaymentService] Backend payment initiate API unavailable, redirecting to simulated gateway:', err?.message)
    }

    // Fallback gateway URL for simulated online checkout (Mintpay, PayHere, Onepay, Koko)
    return {
      order: fullOrder,
      requiresGateway: true,
      gatewayUrl: `/payment/gateway/${backendOrderId}?method=${order.paymentMethod}`,
    }
  }

  // Cash on delivery
  return {
    order: fullOrder,
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
