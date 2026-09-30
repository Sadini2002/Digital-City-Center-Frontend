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
}