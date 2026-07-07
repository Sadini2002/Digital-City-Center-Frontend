import { api } from '../../services/api/client'
import { tryApi, unwrap } from '../utils/deliveryApiHelpers'
import * as store from '../utils/deliveryStorage'

export const trackingApi = {
  getDeliveryTracking: (id) => api.get(`/delivery/deliveries/${id}/live`).then(unwrap),

  updateDeliveryTracking: (id, payload) => api.patch(`/delivery/deliveries/${id}/track`, payload).then(unwrap),

  getOrderTracking: (orderId) =>
    tryApi(
      () => api.get(`/orders/track/${orderId}`).then(unwrap),
      () => store.trackOrderLive(orderId)
    ),

  getOrderDeliveryStatus: async (orderId) => {
    const live = await trackingApi.getOrderTracking(orderId)
    return {
      orderId,
      status: live.delivery?.status,
      delivery: live.delivery,
    }
  },

  getDeliveryLive: (id) => trackingApi.getDeliveryTracking(id),

  getPublic: (trackingCode) => api.get(`/delivery/track/${encodeURIComponent(trackingCode.trim())}`).then(unwrap),

  getPublicViaDelivery: (trackingCode) => trackingApi.getPublic(trackingCode),

  getHistory: (deliveryId) =>
    api.get(`/delivery/deliveries/${deliveryId}/live`).then((res) => res.data?.route ?? []),

  getOrderLive: (orderId) => trackingApi.getOrderTracking(orderId),

  getSubOrderLive: (subOrderId) =>
    tryApi(
      () => Promise.reject(new Error('Sub-order tracking not implemented')),
      () => store.trackSubOrderLive(subOrderId)
    ),

  getAdminLive: () =>
    api.get('/delivery/assigned', { params: { limit: 100 } }).then((res) => {
      const list = res.data?.data ?? res.data?.deliveries ?? []
      return list.filter((d) => ['PROCESSING', 'DISPATCHED', 'OUT_FOR_DELIVERY'].includes(d.status))
    }),
}

export default trackingApi
