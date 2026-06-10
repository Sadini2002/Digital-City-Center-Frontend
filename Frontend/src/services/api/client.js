import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// BACKEND: Attach JWT from login (`POST /auth/login`) on every authenticated request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? 'Unexpected API error'
    const wrapped = new Error(message)
    wrapped.status = error.response?.status
    wrapped.isAxiosError = error.isAxiosError
    return Promise.reject(wrapped)
  },
)
