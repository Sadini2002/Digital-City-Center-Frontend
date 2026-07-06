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

// Frontend GET Request Cache (10 seconds TTL)
const getCache = new Map()
const defaultAdapter = axios.getAdapter(api.defaults.adapter || axios.defaults.adapter)

api.defaults.adapter = async function (config) {
  if (config.method?.toLowerCase() === 'get') {
    const cacheKey = `${config.url}?${new URLSearchParams(config.params || {}).toString()}`
    const cached = getCache.get(cacheKey)
    const now = Date.now()
    if (cached && now - cached.timestamp < 10000) {
      return {
        ...cached.response,
        config,
      }
    }
    const response = await defaultAdapter(config)
    // Only cache successful status codes
    if (response.status >= 200 && response.status < 300) {
      getCache.set(cacheKey, {
        response,
        timestamp: now,
      })
    }
    return response
  }
  return defaultAdapter(config)
}

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
