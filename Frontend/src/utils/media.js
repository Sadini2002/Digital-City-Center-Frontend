import { getAuthToken } from './authStorage'
import { validateUploadFile } from './fileUploadValidation'

/**
 * Upload a file and return a URL string for product images.
 * POSTs to {API}/upload when the backend is available; otherwise uses a dev blob URL.
 */
export default async function mediaUpload(file) {
  if (!(file instanceof File)) {
    throw new Error('Invalid file')
  }

  const validation = validateUploadFile(file, { label: 'Image' })
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const base = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    'http://localhost:5000/api'
  ).replace(/\/+$/, '')

  const token = getAuthToken()

  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${base}/upload`, {
      method: 'POST',
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })

    if (res.ok) {
      const data = await res.json()
      const url = data.url || data.secure_url || data.imageUrl || data.path
      if (url) return url
    }
  } catch {
    // Dev fallback when upload API is unavailable
  }

  return URL.createObjectURL(file)
}
