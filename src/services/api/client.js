import axios from 'axios'
import { clearAdminToken, clearAuthToken, getAdminToken, getAuthToken } from '../../utils/authStorage'
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

const resolvedAdapter = axios.getAdapter
  ? axios.getAdapter(api.defaults.adapter ?? axios.defaults.adapter)
  : api.defaults.adapter || axios.defaults.adapter

if (typeof resolvedAdapter !== 'function') {
  throw new Error('Unable to resolve an Axios adapter for the API client.')
}

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
    const response = await resolvedAdapter(config)
    // Only cache successful status codes
    if (response.status >= 200 && response.status < 300) {
      getCache.set(cacheKey, {
        response,
        timestamp: now,
      })
    }
    return response
  }
  // Mutations should invalidate stale GET snapshots used across dashboard pages.
  getCache.clear()
  return resolvedAdapter(config)
}

// BACKEND: Attach JWT from login (`POST /auth/login`) on every authenticated request.
api.interceptors.request.use((config) => {
  // Share one axios client across buyer/seller/admin portals.
  // Admin pages store auth in `dcc_admin_token`, while marketplace uses `dcc_token`.
  const token = getAuthToken() || getAdminToken()
  if (token) {
    if (!isJwtStructurallyValid(token)) {
      clearAuthToken()
      clearAdminToken()
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
      clearAdminToken()
    }
    const message = error.response?.data?.message ?? error.message ?? 'Unexpected API error'
    return Promise.reject(new Error(message))
  },
)
