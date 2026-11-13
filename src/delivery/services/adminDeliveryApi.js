
import { api } from '../../services/api/client'

export const adminDeliveryApi = {
  // Get provider applications
  listProviders: (params = {}) =>
    api.get('/admin/delivery-providers', { params })
      .then((res) => res.data),

  // Update provider status
  updateProvider: (id, payload) =>
    api.patch(`/admin/delivery-providers/${id}`, payload)
      .then((res) => res.data),

  // Get orders waiting for manual assignment
  listDeliveries: (params = {}) =>
    api.get('/admin/deliveries', { params })
      .then((res) => res.data),

  // Assign an order to a provider manually
  assignDelivery: (payload) =>
    api.post('/admin/deliveries/assign', payload)
      .then((res) => res.data),
}

export default adminDeliveryApi
