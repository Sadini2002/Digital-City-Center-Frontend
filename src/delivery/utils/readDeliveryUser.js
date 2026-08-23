import { ROLES } from '../data/constants'

export function readDeliveryUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
}

export function getDeliveryRoleLabel(user) {
  if (user?.role === ROLES.DELIVERY_PROVIDER) return 'Fleet manager'
  if (user?.role === ROLES.DELIVERY_DRIVER) return 'Driver'
  return 'Partner'
}

export function getDeliveryDisplayName(user) {
  return (
    user?.deliveryDriver?.fullName ||
    user?.deliveryProvider?.companyName ||
    user?.name ||
    'Partner'
  )
}
