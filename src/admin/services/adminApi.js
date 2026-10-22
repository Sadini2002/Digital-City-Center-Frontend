import { api } from '../../services/api/client'

export const adminApi = {
  /* ---------------- Dashboard ---------------- */

  /**
   * KPI numbers + recent pending applications.
   */
  getDashboard: () => api.get('/admin/dashboard'),

  /* ---------------- Seller management ---------------- */

  /**
   * List sellers.
   * params: { status, search, page, limit, sort }
   * status: all | pending | approved | rejected | suspended | removed
   */
  getSellers: (params = {}) => api.get('/admin/sellers', { params }),

  /**
   * Full details of one seller (stats, masked bank info).
   */
  getSellerById: (sellerId) => api.get(`/admin/sellers/${sellerId}`),

  /**
   * Change a seller's status.
   * status: approved | rejected | suspended | removed
   * reason is required for rejected and suspended.
   */
  updateSellerStatus: (sellerId, status, reason) =>
    api.patch(`/admin/sellers/${sellerId}/status`, {
      status,
      ...(reason ? { reason } : {}),
    }),

  /* Kept for existing callers */
  getPendingSellers: () => api.get('/admin/sellers/pending'),

  approveSeller: (sellerId) =>
    api.patch(`/admin/sellers/${sellerId}/status`, { status: 'approved' }),

  rejectSeller: (sellerId, reason) =>
    api.patch(`/admin/sellers/${sellerId}/status`, {
      status: 'rejected',
      reason,
    }),

  /* ---------------- Category management ---------------- */

  /**
   * params: { status: all|active|disabled, search }
   * Response: { data: tree, flat: unfiltered list, stats }
   */
  getCategories: (params = {}) => api.get('/admin/categories', { params }),

  /**
   * payload: FormData with name, parentId, description, status, sortOrder,
   * icon (icon name) and/or iconFile (image).
   */
  createCategory: (payload) => api.post('/admin/categories', payload),

  /**
   * payload: FormData. Send removeIcon=true to clear the icon,
   * parentId='' to make a subcategory top-level.
   */
  updateCategory: (categoryId, payload) => api.patch(`/admin/categories/${categoryId}`, payload),

  /**
   * status: active | disabled. Disabling a parent also disables its
   * subcategories unless cascade is false.
   */
  setCategoryStatus: (categoryId, status, cascade = true) =>
    api.patch(`/admin/categories/${categoryId}/status`, { status, cascade }),

  /* ---------------- Order management ---------------- */

  /**
   * params: { page, limit, search, status, paymentStatus, dateFrom, dateTo,
   *           sellerId, buyerId, dispute: all|open|resolved|none, sort }
   */
  getOrders: (params = {}) => api.get('/admin/orders', { params }),

  getOrderById: (orderId) => api.get(`/admin/orders/${orderId}`),

  updateOrderStatus: (orderId, status, note) =>
    api.patch(`/admin/orders/${orderId}/status`, { status, note }),

  updateOrderPaymentStatus: (orderId, paymentStatus, note) =>
    api.patch(`/admin/orders/${orderId}/payment-status`, { paymentStatus, note }),

  assignOrderDelivery: (orderId, providerId, driverId) =>
    api.post(`/admin/orders/${orderId}/delivery`, {
      providerId,
      ...(driverId ? { driverId } : {}),
    }),

  getOrderSellerOptions: () => api.get('/admin/orders/filters/sellers'),

  getOrderBuyerOptions: (search = '') =>
    api.get('/admin/orders/filters/buyers', { params: { search } }),

  getDeliveryProviderOptions: () => api.get('/admin/orders/filters/delivery-providers'),

  /* ---------------- Disputes ---------------- */

  getDisputes: (params = {}) => api.get('/admin/disputes', { params }),

  getDisputeById: (disputeId) => api.get(`/admin/disputes/${disputeId}`),

  openDispute: (orderId, payload) => api.post(`/admin/orders/${orderId}/disputes`, payload),

  updateDisputeStatus: (disputeId, status, note) =>
    api.patch(`/admin/disputes/${disputeId}/status`, { status, ...(note ? { note } : {}) }),

  /**
   * payload: { resolution: refund_buyer|partial_refund|release_seller|dismissed,
   *            note, refundAmount? }
   */
  resolveDispute: (disputeId, payload) => api.post(`/admin/disputes/${disputeId}/resolve`, payload),
}