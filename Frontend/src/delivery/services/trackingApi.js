/**
 * Tracking helpers — localStorage mocks (same pattern as buyer orderStorage).
 * Buyer hooks import this module; wire to GET /orders/:id/tracking when backend is ready.
 */

import {
  addTrackingBatch,
  getDeliveryLive,
  getTrackingPoints,
  getDeliveries,
  trackOrderLive,
  trackPublic,
  trackSubOrderLive,
} from '../utils/deliveryStorage'

export const trackingApi = {
  getDeliveryTracking: (id) => Promise.resolve(getDeliveryLive(id)),

  updateDeliveryTracking: (id, payload) =>
    Promise.resolve(addTrackingBatch(id, payload.points ?? [payload])),

  getOrderTracking: (orderId) => Promise.resolve(trackOrderLive(orderId)),

  getOrderDeliveryStatus: (orderId) => {
    const live = trackOrderLive(orderId)
    return Promise.resolve({
      orderId,
      status: live.delivery?.status,
      delivery: live.delivery,
    })
  },

  getDeliveryLive: (id) => Promise.resolve(getDeliveryLive(id)),

  getPublic: (trackingCode) => Promise.resolve(trackPublic(trackingCode)),

  getPublicViaDelivery: (trackingCode) => Promise.resolve(trackPublic(trackingCode)),

  getHistory: (deliveryId) => Promise.resolve(getTrackingPoints(deliveryId)),

  getOrderLive: (orderId) => Promise.resolve(trackOrderLive(orderId)),

  getSubOrderLive: (subOrderId) => Promise.resolve(trackSubOrderLive(subOrderId)),

  getAdminLive: () =>
    Promise.resolve(
      getDeliveries().filter((d) =>
        ['PROCESSING', 'DISPATCHED', 'OUT_FOR_DELIVERY'].includes(d.status)
      )
    ),
}

export default trackingApi
