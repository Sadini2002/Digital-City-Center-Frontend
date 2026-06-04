import { ROLES } from './constants'

export function getDashboardPath(role) {
  switch (role) {
    case ROLES.SELLER:
      return '/seller/dashboard'
    case ROLES.ADMIN:
      return '/admin/dashboard'
    case ROLES.DELIVERY_PROVIDER:
    case ROLES.DELIVERY_DRIVER:
      return '/delivery'
    default:
      return '/account'
  }
}

export function getDashboardLabel(role) {
  switch (role) {
    case ROLES.SELLER:
      return 'Seller Dashboard'
    case ROLES.ADMIN:
      return 'Admin Dashboard'
    case ROLES.DELIVERY_PROVIDER:
    case ROLES.DELIVERY_DRIVER:
      return 'Delivery Dashboard'
    default:
      return 'My Account'
  }
}

export function isMarketplaceRole(role) {
  return !role || role === ROLES.BUYER
}
