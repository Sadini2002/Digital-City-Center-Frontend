import { api } from '../../services/api/client'

export const adminApi = {
  /**
   * Get pending seller applications.
   */
  getPendingSellers: () =>
    api.get(
      '/admin/sellers/pending'
    ),

  /**
   * Approve seller.
   */
  approveSeller: (
    sellerId
  ) =>
    api.patch(
      `/admin/sellers/${sellerId}/approve`
    ),

  /**
   * Reject seller.
   */
  rejectSeller: (
    sellerId,
    reason
  ) =>
    api.patch(
      `/admin/sellers/${sellerId}/reject`,
      {
        reason,
      }
    ),
}