import { api } from '../../services/api/client'

export const sellerApi = {
  // =========================
  // SELLER
  // =========================

  getMe: () =>
    api.get('/seller/me'),

  getStatus: () =>
    api.get('/seller/status'),

  getDashboard: (options = {}) =>
    api.get('/seller/dashboard', {
      params: options.refresh
        ? {
            _t: Date.now(),
          }
        : undefined,
    }),

  // =========================
  // NOTIFICATIONS
  // =========================

  getNotifications: () =>
    api.get('/seller/notifications'),

  getUnreadNotificationCount: () =>
    api.get('/seller/notifications/unread-count'),

  markNotificationAsRead: (notificationId) =>
    api.patch(
      `/seller/notifications/${notificationId}/read`
    ),

  markAllNotificationsAsRead: () =>
    api.patch('/seller/notifications/read-all'),
}