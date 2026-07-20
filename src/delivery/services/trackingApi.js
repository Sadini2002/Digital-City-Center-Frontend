import { api } from '../../services/api/client'
import { unwrap } from '../utils/deliveryApiHelpers'
import { isDemoDelivery } from '../utils/deliveryAuth'
import {
  getDeliveryLive as demoGetDeliveryLive,
  trackPublic as demoTrackPublic,
  getTrackingPoints,
  addTrackingBatch,
} from '../utils/deliveryStorage'

export const trackingApi = {
  getDeliveryTracking: (id) => {
    if (isDemoDelivery()) return Promise.resolve(demoGetDeliveryLive(id))
    return api.get(`/delivery/deliveries/${id}/live`).then(unwrap)
  },

  updateDeliveryTracking: (id, payload) => {
    if (isDemoDelivery()) {
      const points = Array.isArray(payload.points) ? payload.points : [payload]
      return Promise.resolve(addTrackingBatch(id, points))
    }
    return api.patch(`/delivery/deliveries/${id}/track`, payload).then(unwrap)
  },

  getOrderTracking: (orderId) => api.get(`/orders/track/${orderId}`).then(unwrap),

  getOrderDeliveryStatus: async (orderId) => {
    const live = await trackingApi.getOrderTracking(orderId)
    return {
      orderId,
      status: live.delivery?.status,
      delivery: live.delivery,
    }
  },

  getDeliveryLive: (id) => trackingApi.getDeliveryTracking(id),

  getPublic: (trackingCode) => {
    if (isDemoDelivery()) {
      try { return Promise.resolve(demoTrackPublic(trackingCode)) }
      catch (e) { return Promise.reject(e) }
    }
    return api.get(`/delivery/track/${encodeURIComponent(trackingCode.trim())}`).then(unwrap)
  },

  getPublicViaDelivery: (trackingCode) => trackingApi.getPublic(trackingCode),

  getHistory: (deliveryId) => {
    if (isDemoDelivery()) return Promise.resolve(getTrackingPoints(deliveryId))
    return api.get(`/delivery/deliveries/${deliveryId}/live`).then((res) => res.data?.route ?? [])
  },

  getOrderLive: (orderId) => trackingApi.getOrderTracking(orderId),

  getSubOrderLive: (subOrderId) => api.get(`/orders/track/${subOrderId}`).then(unwrap),

  getAdminLive: () =>
    api.get('/delivery/assigned', { params: { limit: 100 } }).then((res) => {
      const list = res.data?.data ?? res.data?.deliveries ?? []
      return list.filter((d) => ['PROCESSING', 'DISPATCHED', 'OUT_FOR_DELIVERY'].includes(d.status))
    }),
}

export default trackingApi
