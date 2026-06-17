const SELLER_APPS_KEY = 'dcc_seller_applications'
const ADMIN_CATEGORIES_KEY = 'dcc_admin_categories'
const ADMIN_ANNOUNCEMENTS_KEY = 'dcc_admin_announcements'
const ADMIN_COMMISSION_KEY = 'dcc_admin_commission'
const ADMIN_DELIVERY_PROVIDERS_KEY = 'dcc_admin_delivery_providers'

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getSellerApplications() {
  return readJson(SELLER_APPS_KEY, [])
}

export function updateSellerApplicationStatus(id, status, reason) {
  const list = getSellerApplications()
  const idx = list.findIndex((a) => a.id === id)
  if (idx < 0) return null
  const updated = { ...list[idx], status, rejectionReason: reason || undefined, reviewedAt: new Date().toISOString() }
  list[idx] = updated
  writeJson(SELLER_APPS_KEY, list)
  return updated
}

export function getAdminCategories(seed = []) {
  const existing = readJson(ADMIN_CATEGORIES_KEY, null)
  if (existing && Array.isArray(existing) && existing.length) return existing
  if (seed.length) writeJson(ADMIN_CATEGORIES_KEY, seed)
  return seed
}

export function saveAdminCategories(categories) {
  writeJson(ADMIN_CATEGORIES_KEY, categories)
}

export function getAnnouncements() {
  return readJson(ADMIN_ANNOUNCEMENTS_KEY, [])
}

export function saveAnnouncements(list) {
  writeJson(ADMIN_ANNOUNCEMENTS_KEY, list)
}

export function getCommissionSettings() {
  return readJson(ADMIN_COMMISSION_KEY, {})
}

export function saveCommissionSettings(settings) {
  writeJson(ADMIN_COMMISSION_KEY, settings)
}

export function getDeliveryProviders() {
  const existing = readJson(ADMIN_DELIVERY_PROVIDERS_KEY, null)
  if (existing && Array.isArray(existing) && existing.length) return existing

  const seed = [
    { id: 'dp-1', name: 'SwiftX Logistics', email: 'ops@swiftx.lk', status: 'pending', submittedAt: '2026-05-28' },
    { id: 'dp-2', name: 'Ceylon Courier', email: 'hello@ceyloncourier.lk', status: 'approved', submittedAt: '2026-05-20' },
  ]
  writeJson(ADMIN_DELIVERY_PROVIDERS_KEY, seed)
  return seed
}

export function updateDeliveryProviderStatus(id, status, reason) {
  const list = getDeliveryProviders()
  const idx = list.findIndex((p) => p.id === id)
  if (idx < 0) return null
  const updated = {
    ...list[idx],
    status,
    rejectionReason: reason || undefined,
    reviewedAt: new Date().toISOString(),
  }
  list[idx] = updated
  writeJson(ADMIN_DELIVERY_PROVIDERS_KEY, list)
  syncDeliveryProviderUserFromAdmin(updated)
  return updated
}

function syncDeliveryProviderUserFromAdmin(providerRecord) {
  if (!providerRecord?.email) return
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return
    const user = JSON.parse(raw)
    if (user?.role !== 'DELIVERY_PROVIDER' || !user.deliveryProvider) return
    if (user.email !== providerRecord.email && user.deliveryProvider.id !== providerRecord.id) return

    if (providerRecord.status === 'approved') {
      user.deliveryProvider.status = 'ACTIVE'
      delete user.deliveryProvider.rejectionReason
    } else if (providerRecord.status === 'rejected') {
      user.deliveryProvider.status = 'REJECTED'
      user.deliveryProvider.rejectionReason =
        providerRecord.rejectionReason || 'Your application was not approved. Please contact support.'
    }
    localStorage.setItem('user', JSON.stringify(user))
  } catch {
    // Ignore invalid cached user payload.
  }
}

const ADMIN_PLATFORM_SETTINGS_KEY = 'dcc_admin_platform_settings'

const DEFAULT_PLATFORM_SETTINGS = {
  platformName: 'Digital City Center',
  contactEmail: 'admin@digitalcity.lk',
  pricingModel: 'distance',
  baseFee: 250,
  outOfColomboFee: 150,
  perKmFee: 50,
  flatFee: 350,
  freeThreshold: 5000,
  coverageAreas: ['Colombo', 'Gampaha', 'Kalutara', 'Kandy'],
  unsupportedKeywords: 'india, bengaluru, bangalore, mumbai',
}

export function getPlatformSettings() {
  const existing = readJson(ADMIN_PLATFORM_SETTINGS_KEY, null)
  if (existing) {
    return {
      ...DEFAULT_PLATFORM_SETTINGS,
      ...existing,
      coverageAreas:
        Array.isArray(existing.coverageAreas) && existing.coverageAreas.length > 0
          ? existing.coverageAreas
          : DEFAULT_PLATFORM_SETTINGS.coverageAreas,
      unsupportedKeywords:
        typeof existing.unsupportedKeywords === 'string' && existing.unsupportedKeywords.trim()
          ? existing.unsupportedKeywords
          : DEFAULT_PLATFORM_SETTINGS.unsupportedKeywords,
    }
  }

  writeJson(ADMIN_PLATFORM_SETTINGS_KEY, DEFAULT_PLATFORM_SETTINGS)
  return { ...DEFAULT_PLATFORM_SETTINGS }
}

export const PLATFORM_SETTINGS_UPDATED_EVENT = 'dcc-platform-settings-updated'

export function savePlatformSettings(settings) {
  const payload = {
    ...settings,
    updatedAt: new Date().toISOString(),
  }
  writeJson(ADMIN_PLATFORM_SETTINGS_KEY, payload)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PLATFORM_SETTINGS_UPDATED_EVENT))
  }
  return payload
}


