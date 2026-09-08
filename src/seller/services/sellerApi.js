import { api } from '../../services/api/client'

export const sellerApi = {
  // Logged-in seller profile/status
  getMe: () => api.get('/seller/me'),

  // Seller dashboard
  getDashboard: () => api.get('/seller/dashboard'),
}