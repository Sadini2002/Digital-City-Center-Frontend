/**
 * Admin delivery APIs — PDF backend contract (`/api/v1`).
 */

import { api, tryApi, unwrap, unwrapMeta } from '../utils/deliveryApiHelpers'

export const adminDeliveryApi = {
  listProviders: (params) =>
    api.get('/admin/delivery-providers', { params }).then(unwrapMeta),

  approveProvider: (id, payload) =>
    api.put(`/admin/delivery-providers/${id}/approve`, payload).then(unwrap),

  rejectProvider: (id, payload) =>
    api.put(`/admin/delivery-providers/${id}/reject`, payload).then(unwrap),

  listDeliveries: (params) =>
    api.get('/admin/deliveries', { params }).then(unwrapMeta),

  assignDelivery: (payload) =>
    api.post('/admin/deliveries/assign', payload).then(unwrap),
}

export default adminDeliveryApi
