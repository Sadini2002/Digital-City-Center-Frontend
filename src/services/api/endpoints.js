import { api } from './client'

export const healthApi = {
  check: () => api.get('/health'),
}

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  registerSeller: (payload) => api.post('/auth/register/seller', payload),
  registerDeliveryProvider: (payload) => api.post('/delivery/register', payload),
}

export const usersApi = {
  getProfile: () => api.get('/users/me'),
}

export const listingsApi = {
  search: (params) => api.get('/search', { params }),
  getCategories: () => api.get('/search/categories'),
  getProductsByCategory: (slug) => api.get(`/search/category/${encodeURIComponent(slug)}`),
  suggestions: (params, config = {}) => api.get('/search/suggestions', { params, ...config }),
}

export const productsApi = {
  getById: (id) => api.get(`/products/${encodeURIComponent(id)}`),
}

export const supportApi = {
  submitContact: (payload) => api.post('/support/contact', payload),
}

export const cartApi = {
  get: () => api.get('/cart'),
  add: (payload) => api.post('/cart/add', payload),
  update: (id, payload) => api.put(`/cart/update/${encodeURIComponent(id)}`, payload),
  remove: (id) => api.delete(`/cart/${encodeURIComponent(id)}`),
  clear: () => api.delete('/cart/clear'),
}

export const ordersApi = {
  checkout: (payload) => api.post('/orders/checkout', payload),
}

export const paymentsApi = {
  initiate: (payload) => api.post('/payments/initiate', payload),
}

