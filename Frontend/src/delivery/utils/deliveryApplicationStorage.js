/**
 * Local-only registration fallback when POST /auth/register/delivery is unavailable.
 * BACKEND: Remove once register + admin approval APIs are live.
 */
import { getDeliveryProviders } from '../../admin/utils/adminStorage'

const USER_KEY = 'user'
const TOKEN_KEY = 'token'

export function saveDeliveryApplication(form) {
  const providers = getDeliveryProviders()
  const entry = {
    id: `dp-${Date.now()}`,
    name: form.companyName,
    email: form.email,
    status: 'pending',
    submittedAt: new Date().toISOString().slice(0, 10),
    phone: form.phone,
    district: form.district,
    serviceAreas: form.serviceAreas,
  }
  providers.unshift(entry)
  localStorage.setItem('dcc_admin_delivery_providers', JSON.stringify(providers))

  const user = {
    id: entry.id,
    name: form.fullName,
    email: form.email,
    role: 'DELIVERY_PROVIDER',
    phone: form.phone,
    deliveryProvider: {
      id: entry.id,
      companyName: form.companyName,
      status: 'PENDING',
      businessRegNo: form.businessRegNo,
      district: form.district,
      serviceAreas: form.serviceAreas,
    },
  }

  localStorage.setItem(TOKEN_KEY, `delivery-${entry.id}`)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  sessionStorage.setItem('dcc_last_delivery_application', JSON.stringify({ user, entry }))

  return { token: localStorage.getItem(TOKEN_KEY), user }
}

export function activateDemoDeliveryProvider() {
  const user = {
    id: 'delivery-demo-1',
    name: 'Demo Courier',
    email: 'delivery@demo.local',
    role: 'DELIVERY_PROVIDER',
    deliveryProvider: {
      id: 'delivery-demo-1',
      companyName: 'Demo Courier Ltd',
      status: 'ACTIVE',
      district: 'Colombo',
    },
  }
  localStorage.setItem(TOKEN_KEY, 'demo-delivery-token')
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export function activateDemoDeliveryDriver() {
  const user = {
    id: 'driver-demo-user',
    name: 'Demo Rider',
    email: 'rider@demo.local',
    role: 'DELIVERY_DRIVER',
    deliveryDriver: {
      id: 'driver-demo',
      fullName: 'Demo Rider',
      phone: '+94 77 555 0101',
      vehicleType: 'Motorcycle',
      vehiclePlate: 'CAB-1234',
      isAvailable: true,
      totalDeliveries: 12,
      status: 'ACTIVE',
    },
  }
  localStorage.setItem(TOKEN_KEY, 'demo-driver-token')
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export function syncUserApprovalFromAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || '{}')
    if (user?.role !== 'DELIVERY_PROVIDER' || !user?.deliveryProvider) return user
    const providers = getDeliveryProviders()
    const match = providers.find(
      (p) => p.email === user.email || p.id === user.deliveryProvider?.id
    )
    if (match?.status === 'approved' && user.deliveryProvider.status !== 'ACTIVE') {
      user.deliveryProvider.status = 'ACTIVE'
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
    return user
  } catch {
    return null
  }
}
