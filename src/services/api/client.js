import axios from 'axios'
import { clearAuthToken, getAuthToken } from '../../utils/authStorage'
import { isJwtStructurallyValid } from '../../utils/jwtValidation'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
})

// BACKEND: Attach JWT from login (`POST /auth/login`) on every authenticated request.
api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    if (!isJwtStructurallyValid(token)) {
      clearAuthToken()
      return Promise.reject(new Error('Session expired or invalid. Please sign in again.'))
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  config.withCredentials = true
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken()
    }
    const message = error.response?.data?.message ?? error.message ?? 'Unexpected API error'
    return Promise.reject(new Error(message))
  },
)
