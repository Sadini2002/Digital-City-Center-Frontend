import { getAuthToken } from '../../utils/authStorage'

const DEMO_TOKENS = ['demo-delivery-token', 'demo-driver-token']

/** Returns true when the active session is a local demo (no real backend JWT). */
export function isDemoDelivery() {
  return DEMO_TOKENS.includes(getAuthToken())
}

/** Returns the user stored in localStorage (used as fallback in demo mode). */
export function getStoredDeliveryUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

/** Delivery provider profile is ready for the portal */
export function isDeliveryProviderActive(user) {
  const provider = user?.deliveryProvider
  if (!provider) return false
  if (provider.status === 'ACTIVE') return true
  return user?.status === 'ACTIVE' && user?.role === 'DELIVERY_PROVIDER'
}

/** Delivery driver profile is ready for the portal */
export function isDeliveryDriverActive(user) {
  const driver = user?.deliveryDriver
  if (!driver) return false
  if (driver.status === 'ACTIVE') return true
  return user?.status === 'ACTIVE' && user?.role === 'DELIVERY_DRIVER'
}

export function getDeliveryProfileStatus(user) {
  if (user?.role === 'DELIVERY_DRIVER') {
    return user?.deliveryDriver?.status
  }
  return user?.deliveryProvider?.status
}

export function isDeliveryRole(role) {
  const r = String(role ?? '').toUpperCase()
  return r === 'DELIVERY_PROVIDER' || r === 'DELIVERY_DRIVER'
}
