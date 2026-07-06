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
