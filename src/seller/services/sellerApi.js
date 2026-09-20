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
  // SHOP SETTINGS
  // =========================

  getShopSettings: () =>
    api.get('/seller/settings'),

  updateShopSettings: (data) =>
    api.put('/seller/settings', data),

  uploadShopLogo: (file) => {
    const formData = new FormData()
    formData.append('logo', file)

    return api.post(
      '/seller/settings/images/logo',
      formData
    )
  },

  uploadShopBanner: (file) => {
    const formData = new FormData()
    formData.append('banner', file)

    return api.post(
      '/seller/settings/images/banner',
      formData
    )
  },

  removeShopLogo: () =>
    api.delete('/seller/settings/images/logo'),

  removeShopBanner: () =>
    api.delete('/seller/settings/images/banner'),

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

  // =========================
  // ORDERS
  // =========================

  // params: { status, search, page, limit }
  getOrders: (params = {}) =>
    api.get('/orders/seller-orders', { params }),

  getOrderById: (orderId) =>
    api.get(`/orders/seller-orders/${orderId}`),

  updateOrderStatus: (orderId, status) =>
    api.patch(`/orders/${orderId}/status`, { status }),

  // =========================
  // BANK / PAYOUT DETAILS
  // =========================

  getBankDetails: () =>
    api.get('/seller/bank-details'),

  updateBankDetails: (data) =>
    api.put('/seller/bank-details', data),
}