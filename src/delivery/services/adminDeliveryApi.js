/**
 * Admin delivery APIs — backend contract (`/api/v1/admin`).
 */

import { api } from '../../services/api/client'

export const adminDeliveryApi = {
  listProviders: (params) => api.get('/admin/delivery-providers', { params }).then(res => res.data),
  approveProvider: (id, payload) => api.put(`/admin/delivery-providers/${id}/approve`, payload).then(res => res.data),
  rejectProvider: (id, payload) => api.put(`/admin/delivery-providers/${id}/reject`, payload).then(res => res.data),
  listDeliveries: (params) => api.get('/admin/deliveries', { params }).then(res => res.data),
  assignDelivery: (payload) => api.post('/admin/deliveries/assign', payload).then(res => res.data),
}

export default adminDeliveryApi
