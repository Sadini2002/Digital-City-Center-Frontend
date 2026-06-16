/** BACKEND: Wire PDF /api/v1 routes here when server is ready. Pages use deliveryStorage directly. */

import * as store from '../utils/deliveryStorage'

/** @deprecated Use deliveryStorage in pages. Async wrappers for legacy imports only. */
export const deliveryApi = {
  getDashboard: () => Promise.resolve(store.getDashboardStats()),
  listDeliveries: (params) => Promise.resolve(store.listAssignedDeliveries(params)),
  listPool: (params) => Promise.resolve(store.listPoolDeliveries(params)),
  getDelivery: (id) => {
    const d = store.getDeliveryById(id)
    if (!d) return Promise.reject(new Error('Delivery not found'))
    return Promise.resolve(d)
  },
  acceptDelivery: (id) => Promise.resolve(store.acceptDeliveryForCurrentDriver(id)),
  updateStatus: (id, payload) => Promise.resolve(store.updateDeliveryStatus(id, payload)),
  addTrackingBatch: (id, points) => Promise.resolve(store.addTrackingBatch(id, points)),
  getEarnings: (params) => Promise.resolve(store.getEarnings(params)),
  getAnalytics: (params) => Promise.resolve(store.getAnalytics(params)),
  listDrivers: () => Promise.resolve(store.getDrivers()),
  createDriver: (payload) => Promise.resolve(store.createDriver(payload)),
  updateDriver: (id, payload) => Promise.resolve(store.updateDriver(id, payload)),
  listNotifications: (params) => Promise.resolve(store.listNotifications(params)),
  markNotificationRead: (id) => Promise.resolve(store.markNotificationRead(id)),
  markAllNotificationsRead: () => Promise.resolve(store.markAllNotificationsRead()),
  deleteNotification: (id) => Promise.resolve(store.deleteNotification(id)),
}

export default deliveryApi
