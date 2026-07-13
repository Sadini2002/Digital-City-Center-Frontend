const MAPS_SCRIPT_ID = 'google-maps-js'

/** BACKEND: Set VITE_GOOGLE_MAPS_API_KEY in .env — Maps JavaScript API + Geometry library */
export function isGoogleMapsConfigured() {
  return Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
}

export function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google)
      return
    }

    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!key) {
      reject(new Error('Google Maps API key is not configured'))
      return
    }

    const existing = document.getElementById(MAPS_SCRIPT_ID)
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google))
      existing.addEventListener('error', reject)
      return
    }

    const script = document.createElement('script')
    script.id = MAPS_SCRIPT_ID
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=geometry`
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.google)
    script.onerror = reject
    document.head.appendChild(script)
  })
}
