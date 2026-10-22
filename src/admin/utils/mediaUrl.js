const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1'

// "http://localhost:5000/api/v1" -> "http://localhost:5000"
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v\d+\/?$/, '').replace(/\/$/, '')

/**
 * Turns a stored upload path ("/uploads/categories/x.png") into a full URL.
 * Absolute, data: and blob: URLs are returned untouched.
 */
export function resolveAssetUrl(value) {
  if (!value) return null
  if (/^(https?:|data:|blob:)/i.test(value)) return value
  return `${API_ORIGIN}${value.startsWith('/') ? '' : '/'}${value}`
}

/** True when the stored icon is an image path/URL rather than an icon name. */
export function isImageIcon(value) {
  return Boolean(value) && /^(\/|https?:|data:|blob:)/i.test(value)
}