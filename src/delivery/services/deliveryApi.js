import { api } from '../../services/api/client'
import { unwrap, unwrapMeta } from '../utils/deliveryApiHelpers'

export const deliveryApi = {
  getDashboard: () => api.get('/delivery/dashboard').then(unwrap),

  listDeliveries: (params) => api.get('/delivery/assigned', { params }).then(unwrapMeta),

  listPool: (params) => api.get('/delivery/pool', { params }).then(unwrapMeta),

  getDelivery: (id) => api.get(`/delivery/deliveries/${id}`).then(unwrap),

  acceptDelivery: (id) => api.post(`/delivery/${id}/accept`).then(unwrap),

  updateStatus: (id, payload) => api.put(`/delivery/deliveries/${id}/status`, payload).then(unwrap),

  addTrackingBatch: (id, points) => api.patch(`/delivery/deliveries/${id}/track`, { points }).then(unwrap),

  getEarnings: (params) => api.get('/delivery/earnings', { params }).then(unwrap),

  getAnalytics: (params) => api.get('/delivery/analytics', { params }).then(unwrap),

  listDrivers: () => api.get('/delivery/drivers').then(unwrap),

  createDriver: (payload) => api.post('/delivery/drivers', payload).then(unwrap),

  updateDriver: (id, payload) => api.patch(`/delivery/drivers/${id}`, payload).then(unwrap),

  listNotifications: (params) => api.get('/delivery/notifications', { params }).then(unwrapMeta),

  getUnreadNotificationCount: () => api.get('/delivery/notifications/unread-count').then((res) => res.data?.count ?? 0),

  markNotificationRead: (id) => api.put(`/delivery/notifications/${id}/read`).then(unwrap),

  markAllNotificationsRead: () => api.put('/delivery/notifications/read-all').then(unwrap),

  deleteNotification: (id) => api.delete(`/delivery/notifications/${id}`).then(unwrap),

  getSettings: () => api.get('/delivery/settings').then(unwrap),

  updateSettings: (payload) => api.put('/delivery/settings', payload).then(unwrap),
}

export default deliveryApi
