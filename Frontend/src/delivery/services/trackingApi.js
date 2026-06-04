/**
 * Tracking API — PDF backend contract (`/api/v1`).
 *
 *   GET /deliveries/:id/tracking
 *   PUT /deliveries/:id/tracking
 *   GET /orders/:id/tracking
 *   GET /orders/:id/delivery-status
 *
 * Falls back to deliveryStorage mocks when API is unreachable.
 */

import * as store from '../utils/deliveryStorage'
import { api, tryApi, unwrap } from '../utils/deliveryApiHelpers'

export const trackingApi = {
  getDeliveryTracking: (id) =>
    tryApi(
      () => api.get(`/deliveries/${id}/tracking`).then(unwrap),
      () => store.getDeliveryLive(id)
    ),

  updateDeliveryTracking: (id, payload) =>
    tryApi(
      () => api.put(`/deliveries/${id}/tracking`, payload).then(unwrap),
      () => store.addTrackingBatch(id, payload.points ?? [payload])
    ),

  getOrderTracking: (orderId) =>
    tryApi(
      () => api.get(`/orders/${encodeURIComponent(orderId)}/tracking`).then(unwrap),
      () => store.trackOrderLive(orderId)
    ),

  getOrderDeliveryStatus: (orderId) =>
    tryApi(
      () => api.get(`/orders/${encodeURIComponent(orderId)}/delivery-status`).then(unwrap),
      () => {
        const live = store.trackOrderLive(orderId)
        return { orderId, status: live.delivery?.status, delivery: live.delivery }
      }
    ),

  // --- Compatibility (existing hooks/pages) ---

  getDeliveryLive: (id) => trackingApi.getDeliveryTracking(id),

  getPublic: (trackingCode) =>
    tryApi(
      () =>
        api
          .get('/deliveries/history', { params: { trackingCode } })
          .then(unwrap)
          .then((data) => data?.delivery ?? data),
      () => store.trackPublic(trackingCode)
    ),

  getPublicViaDelivery: (trackingCode) => trackingApi.getPublic(trackingCode),

  getHistory: (deliveryId, params) =>
    tryApi(
      () => api.get(`/deliveries/${deliveryId}/tracking`, { params }).then(unwrap),
      () => store.getTrackingPoints(deliveryId)
    ),

  getOrderLive: (orderId) => trackingApi.getOrderTracking(orderId),

  getSubOrderLive: (subOrderId) =>
    tryApi(
      () => api.get(`/orders/${encodeURIComponent(subOrderId)}/tracking`).then(unwrap),
      () => store.trackSubOrderLive(subOrderId)
    ),

  getAdminLive: (params = {}) =>
    tryApi(
      () => api.get('/admin/deliveries', { params }).then(unwrap),
      () =>
        store
          .getDeliveries()
          .filter((d) => ['PROCESSING', 'DISPATCHED', 'OUT_FOR_DELIVERY'].includes(d.status))
    ),
}

export default trackingApi
