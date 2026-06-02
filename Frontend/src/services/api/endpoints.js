import { api } from './client'

export const healthApi = {
  check: () => api.get('/health'),
}

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  registerSeller: (payload) => api.post('/auth/register/seller', payload),
}

export const usersApi = {
  getProfile: () => api.get('/users/me'),
}
