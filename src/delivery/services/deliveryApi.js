import { api } from '../../services/api/client'
import { unwrap, unwrapMeta } from '../utils/deliveryApiHelpers'
import { isDemoDelivery } from '../utils/deliveryAuth'
import * as store from '../utils/deliveryStorage'

const SETTINGS_KEY = 'dcc_delivery_settings'

function readDemoSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} } })()
  return {
    coverageAreas: user?.deliveryProvider?.serviceAreas ?? ['Colombo', 'Gampaha', 'Kandy'],
    district: user?.deliveryProvider?.district ?? 'Colombo',
    pricingModel: 'distance',
    baseFee: 250,
    perKmFee: 50,
    freeThreshold: 10000,
    flatFee: 450,
    status: user?.deliveryProvider?.status ?? 'ACTIVE',
  }
}

function saveDemoSettings(payload) {
  const current = readDemoSettings()
  const updated = { ...current, ...payload }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated))
  return updated
}

export const deliveryApi = {
  getDashboard: () => {
    if (isDemoDelivery()) return Promise.resolve(store.getDashboardStats())
    return api.get('/delivery/dashboard').then(unwrap)
  },

  listDeliveries: (params) => {
    if (isDemoDelivery()) return Promise.resolve(store.listAssignedDeliveries(params))
    return api.get('/delivery/assigned', { params }).then(unwrapMeta)
  },

  listPool: (params) => {
    if (isDemoDelivery()) return Promise.resolve(store.listPoolDeliveries(params))
    return api.get('/delivery/pool', { params }).then(unwrapMeta)
  },

  getDelivery: (id) => {
    if (isDemoDelivery()) {
      const d = store.getDeliveryById(id)
      if (!d) return Promise.reject(new Error('Delivery not found'))
      return Promise.resolve(d)
    }
    return api.get(`/delivery/deliveries/${id}`).then(unwrap)
  },

  acceptDelivery: (id) => {
    if (isDemoDelivery()) return Promise.resolve(store.acceptDeliveryForCurrentDriver(id))
    return api.post(`/delivery/${id}/accept`).then(unwrap)
  },

  updateStatus: (id, payload) => {
    if (isDemoDelivery()) return Promise.resolve(store.updateDeliveryStatus(id, payload))
    return api.put(`/delivery/deliveries/${id}/status`, payload).then(unwrap)
  },

  addTrackingBatch: (id, points) => {
    if (isDemoDelivery()) return Promise.resolve(store.addTrackingBatch(id, points))
    return api.patch(`/delivery/deliveries/${id}/track`, { points }).then(unwrap)
  },

  getEarnings: (params) => {
    if (isDemoDelivery()) return Promise.resolve(store.getEarnings(params))
    return api.get('/delivery/earnings', { params }).then(unwrap)
  },

  getAnalytics: (params) => {
    if (isDemoDelivery()) return Promise.resolve(store.getAnalytics(params))
    return api.get('/delivery/analytics', { params }).then(unwrap)
  },

  listDrivers: () => {
    if (isDemoDelivery()) return Promise.resolve(store.getDrivers())
    return api.get('/delivery/drivers').then(unwrap)
  },

  createDriver: (payload) => {
    if (isDemoDelivery()) return Promise.resolve(store.createDriver(payload))
    return api.post('/delivery/drivers', payload).then(unwrap)
  },

  updateDriver: (id, payload) => {
    if (isDemoDelivery()) return Promise.resolve(store.updateDriver(id, payload))
    return api.patch(`/delivery/drivers/${id}`, payload).then(unwrap)
  },

  listNotifications: (params) => {
    if (isDemoDelivery()) return Promise.resolve(store.listNotifications(params))
    return api.get('/delivery/notifications', { params }).then(unwrapMeta)
  },

  getUnreadNotificationCount: () => {
    if (isDemoDelivery()) return Promise.resolve(store.getUnreadNotificationCount())
    return api.get('/delivery/notifications/unread-count').then((res) => res.data?.count ?? 0)
  },

  markNotificationRead: (id) => {
    if (isDemoDelivery()) return Promise.resolve(store.markNotificationRead(id))
    return api.put(`/delivery/notifications/${id}/read`).then(unwrap)
  },

  markAllNotificationsRead: () => {
    if (isDemoDelivery()) return Promise.resolve(store.markAllNotificationsRead())
    return api.put('/delivery/notifications/read-all').then(unwrap)
  },

  deleteNotification: (id) => {
    if (isDemoDelivery()) return Promise.resolve(store.deleteNotification(id))
    return api.delete(`/delivery/notifications/${id}`).then(unwrap)
  },

  getSettings: () => {
    if (isDemoDelivery()) return Promise.resolve(readDemoSettings())
    return api.get('/delivery/settings').then(unwrap)
  },

  updateSettings: (payload) => {
    if (isDemoDelivery()) return Promise.resolve(saveDemoSettings(payload))
    return api.put('/delivery/settings', payload).then(unwrap)
  },
}

export default deliveryApi
