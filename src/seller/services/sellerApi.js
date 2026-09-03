import { api } from '../../services/api/client'

export const sellerApi = {
  /**
   * Get logged-in seller profile.
   */
  getMe: () =>
    api.get('/sellers/me'),

  /**
   * Get approved seller dashboard.
   */
  getDashboard: () =>
    api.get('/sellers/dashboard'),
}