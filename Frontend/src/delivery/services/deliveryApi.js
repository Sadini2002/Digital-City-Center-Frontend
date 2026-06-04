/**
 * Delivery portal API — PDF backend contract (`/api/v1`).
 *
 * Delivery Provider:
 *   POST /delivery-providers/register
 *   GET  /delivery-providers/profile
 *   PUT  /delivery-providers/profile
 *   GET  /delivery-providers/jobs
 *
 * Assignment:
 *   POST /deliveries/assign
 *   GET  /deliveries/assigned
 *   GET  /deliveries/:id
 *
 * Status:
 *   PUT  /deliveries/:id/status
 *   GET  /deliveries/status
 *   GET  /deliveries/history
 *
 * Notifications:
 *   GET /delivery/notifications
 *   PUT /delivery/notifications/:id/read
 *
 * Pages call the compatibility methods below; mocks in deliveryStorage when API is down.
 */

import * as store from '../utils/deliveryStorage'
import {
  api,
  getDriverId,
  tryApi,
  toListMeta,
  unwrap,
  unwrapMeta,
} from '../utils/deliveryApiHelpers'

export const deliveryApi = {
  // --- PDF endpoints (direct) ---

  registerProvider: (payload) =>
    tryApi(
      () => api.post('/delivery-providers/register', payload).then(unwrap),
      () => store.registerProviderMock(payload)
    ),

  getProviderProfile: () =>
    tryApi(
      () => api.get('/delivery-providers/profile').then(unwrap),
      () => store.getProviderProfileMock()
    ),

  updateProviderProfile: (payload) =>
    tryApi(
      () => api.put('/delivery-providers/profile', payload).then(unwrap),
      () => store.updateProviderProfileMock(payload)
    ),

  listProviderJobs: (params) =>
    tryApi(
      () =>
        api.get('/delivery-providers/jobs', { params }).then((res) => {
          const raw = unwrapMeta(res)
          return toListMeta(raw, params)
        }),
      () => store.listPoolDeliveries(params)
    ),

  assignDelivery: (payload) =>
    tryApi(
      () => api.post('/deliveries/assign', payload).then(unwrap),
      () => store.acceptDelivery(payload.deliveryId ?? payload.id, getDriverId())
    ),

  listAssigned: (params) =>
    tryApi(
      () =>
        api.get('/deliveries/assigned', { params }).then((res) => {
          const raw = unwrapMeta(res)
          return toListMeta(raw, params)
        }),
      () => store.listAssignedDeliveries(params, getDriverId())
    ),

  getDeliveryById: (id) =>
    tryApi(
      () => api.get(`/deliveries/${id}`).then(unwrap),
      () => {
        const d = store.getDeliveryById(id)
        if (!d) throw new Error('Delivery not found')
        return d
      }
    ),

  getDeliveriesStatus: (params) =>
    tryApi(
      () => api.get('/deliveries/status', { params }).then(unwrap),
      () => store.getDeliveriesStatusMock()
    ),

  getDeliveriesHistory: (params) =>
    tryApi(
      () => api.get('/deliveries/history', { params }).then(unwrap),
      () => store.getDeliveriesHistoryMock(params)
    ),

  updateDeliveryStatus: (id, payload) =>
    tryApi(
      () => api.put(`/deliveries/${id}/status`, payload).then(unwrap),
      () => store.updateDeliveryStatus(id, payload)
    ),

  listNotifications: (params = {}) => {
    const page = params.page || 1
    const limit = params.limit || 20
    return tryApi(
      () => api.get('/delivery/notifications', { params }).then(unwrapMeta),
      () => {
        const all = store.getNotifications()
        return store.paginate(all, { page, limit })
      }
    )
  },

  markNotificationRead: (id) =>
    tryApi(
      () => api.put(`/delivery/notifications/${id}/read`).then(unwrap),
      () => {
        const list = store.getNotifications().map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
        store.saveNotifications(list)
        return list.find((n) => n.id === id)
      }
    ),

  // --- Compatibility layer (used by existing pages) ---

  getDashboard: () =>
    tryApi(
      async () => {
        const [assignedRes, statusRes] = await Promise.all([
          api.get('/deliveries/assigned', { params: { limit: 5 } }),
          api.get('/deliveries/status'),
        ])
        const assigned = toListMeta(unwrapMeta(assignedRes), { limit: 5 })
        const status = unwrap(statusRes) || {}
        const stats = status.stats ?? status
        return {
          stats: {
            pending: stats.pending ?? stats.confirmed ?? stats.openJobs ?? 0,
            active: stats.active ?? stats.inProgress ?? 0,
            deliveredToday: stats.deliveredToday ?? stats.delivered ?? 0,
          },
          recentDeliveries: assigned.data ?? [],
        }
      },
      () => store.getDashboardStats()
    ),

  listDeliveries: (params) => deliveryApi.listAssigned(params),

  listPool: (params) => deliveryApi.listProviderJobs(params),

  getDelivery: (id) => deliveryApi.getDeliveryById(id),

  acceptDelivery: (id) =>
    deliveryApi.assignDelivery({ deliveryId: id, driverId: getDriverId() }),

  updateStatus: (id, payload) => {
    const body = { ...payload }
    if (body.failureReason && !body.reason) {
      body.reason = body.failureReason
    }
    if (body.status === 'FAILED') body.status = 'CANCELLED'
    return deliveryApi.updateDeliveryStatus(id, body)
  },

  addTracking: (id, payload) =>
    tryApi(
      () => api.put(`/deliveries/${id}/tracking`, payload).then(unwrap),
      () => store.addTrackingPoint(id, payload)
    ),

  /** PUT /deliveries/:id/tracking — batched GPS from driver device */
  addTrackingBatch: (id, points) =>
    tryApi(
      () => api.put(`/deliveries/${id}/tracking`, { points }).then(unwrap),
      () => store.addTrackingBatch(id, points)
    ),

  /** No PDF endpoint — mock only for dev */
  getEarnings: (params) =>
    tryApi(
      () =>
        api
          .get('/deliveries/history', { params: { ...params, summary: 'earnings' } })
          .then(unwrap)
          .then((data) => data?.earnings ?? data),
      () => store.getEarnings(params)
    ),

  /** Derived from GET /deliveries/status + history when available */
  getAnalytics: (params) =>
    tryApi(
      async () => {
        const [status, history] = await Promise.all([
          api.get('/deliveries/status', { params }),
          api.get('/deliveries/history', { params }),
        ])
        const statusData = unwrap(status) || {}
        if (statusData.completed != null) return statusData
        const hist = unwrap(history)
        return hist?.analytics ?? hist ?? statusData
      },
      () => store.getAnalytics(params)
    ),

  /** Fleet drivers — not in PDF; mock only until backend adds endpoint */
  listDrivers: () => tryApi(() => Promise.reject(new Error('no endpoint')), () => store.getDrivers()),

  createDriver: (payload) =>
    tryApi(() => Promise.reject(new Error('no endpoint')), () => store.createDriver(payload)),

  updateDriver: (id, payload) =>
    tryApi(
      () => api.put('/delivery-providers/profile', { driverId: id, ...payload }).then(unwrap),
      () => store.updateDriver(id, payload)
    ),

  markAllNotificationsRead: () =>
    tryApi(
      () => Promise.reject(new Error('no endpoint')),
      () => {
        const list = store.getNotifications().map((n) => ({ ...n, read: true }))
        store.saveNotifications(list)
        return list
      }
    ),

  deleteNotification: (id) =>
    tryApi(
      () => Promise.reject(new Error('no endpoint')),
      () => {
        const list = store.getNotifications().filter((n) => n.id !== id)
        store.saveNotifications(list)
        return { ok: true }
      }
    ),

  deleteAllNotifications: () =>
    tryApi(
      () => Promise.reject(new Error('no endpoint')),
      () => {
        store.saveNotifications([])
        return { ok: true }
      }
    ),
}

export default deliveryApi
