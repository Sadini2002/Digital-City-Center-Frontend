const SELLER_APPS_KEY = 'dcc_seller_applications'
const ADMIN_CATEGORIES_KEY = 'dcc_admin_categories'
const ADMIN_ANNOUNCEMENTS_KEY = 'dcc_admin_announcements'
const ADMIN_COMMISSION_KEY = 'dcc_admin_commission'
const ADMIN_DELIVERY_PROVIDERS_KEY = 'dcc_admin_delivery_providers'
const PLATFORM_SETTINGS_KEY = 'dcc_platform_settings'

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

export function updateSellerApplicationStatus(id, status, rejectionReason = null) {
  const list = getSellerApplications()
  const idx = list.findIndex((a) => a.id === id)
  if (idx < 0) return null
  const updated = {
    ...list[idx],
    status,
    reviewedAt: new Date().toISOString(),
    ...(rejectionReason ? { rejectionReason } : {}),
  }
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

export function updateDeliveryProviderStatus(id, status, rejectionReason = null) {
  const list = getDeliveryProviders()
  const idx = list.findIndex((p) => p.id === id)
  if (idx < 0) return null
  const updated = {
    ...list[idx],
    status,
    reviewedAt: new Date().toISOString(),
    ...(rejectionReason ? { rejectionReason } : {}),
  }
  list[idx] = updated
  writeJson(ADMIN_DELIVERY_PROVIDERS_KEY, list)
  return updated
}

export function getPlatformSettings() {
  return readJson(PLATFORM_SETTINGS_KEY, {
    platformName: 'Digital City Center',
    contactEmail: 'support@dcc.lk',
    baseDeliveryFee: 350,
    outOfColomboSurcharge: 200,
    disallowedKeywords: 'india, bangalore, mumbai',
  })
}

export function savePlatformSettings(settings) {
  writeJson(PLATFORM_SETTINGS_KEY, settings)
}

