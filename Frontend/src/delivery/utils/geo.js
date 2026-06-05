const DEFAULT_CENTER = { lat: 6.9271, lng: 79.8612 }

export function getDefaultCenter() {
  return DEFAULT_CENTER
}

export function formatEta(minutes) {
  if (minutes == null) return '—'
  if (minutes < 60) return `${Math.round(minutes)} min`
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return m ? `${h}h ${m}m` : `${h}h`
}

export function formatDistance(km) {
  if (km == null) return '—'
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

/** Normalize API/map point shapes (lat/lng or latitude/longitude) */
export function toLatLng(point) {
  if (!point) return null
  const lat = point.latitude ?? point.lat
  const lng = point.longitude ?? point.lng
  if (lat == null || lng == null) return null
  return { lat: Number(lat), lng: Number(lng) }
}

export function routeToPath(route = []) {
  return route.map(toLatLng).filter(Boolean)
}

export function mapsLink(point, label = '') {
  const ll = toLatLng(point)
  if (!ll) return null
  return `https://www.google.com/maps/search/?api=1&query=${ll.lat},${ll.lng}`
}
