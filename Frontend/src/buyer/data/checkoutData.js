export const savedAddresses = [
  {
    id: 'home-colombo',
    label: 'Home',
    name: 'Amara Perera',
    phone: '+94 77 123 4567',
    line1: '42/5, Flower Road',
    line2: 'Colombo 07',
    city: 'Colombo',
    district: 'Colombo',
    postalCode: '00700',
    isDefault: true,
  },
  {
    id: 'office-kandy',
    label: 'Office',
    name: 'Amara Perera',
    phone: '+94 77 123 4567',
    line1: 'Digital City Center Hub',
    line2: 'Peradeniya Road',
    city: 'Kandy',
    district: 'Kandy',
    postalCode: '20000',
    isDefault: false,
  },
]

const SAVED_ADDRESSES_KEY = 'dcc_saved_addresses'

export function getSavedAddresses() {
  try {
    const raw = localStorage.getItem(SAVED_ADDRESSES_KEY)
    if (!raw) return [...savedAddresses]
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : [...savedAddresses]
  } catch {
    return [...savedAddresses]
  }
}

export function setSavedAddresses(addresses) {
  try {
    localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(addresses))
  } catch {
    // ignore localStorage failures
  }
}

export function normalizeAddressList(addresses) {
  const list = Array.isArray(addresses) ? [...addresses] : []
  const hasDefault = list.some((addr) => addr.isDefault)
  return list.map((addr, index) => ({
    ...addr,
    isDefault: hasDefault ? Boolean(addr.isDefault) : index === 0,
  }))
}

export function saveAddress(address) {
  const current = getSavedAddresses()
  const normalized = normalizeAddressList(
    address.isDefault
      ? [address, ...current.map((addr) => ({ ...addr, isDefault: false }))]
      : current,
  )

  const existingIndex = normalized.findIndex((addr) => addr.id === address.id)
  const next = existingIndex >= 0
    ? normalized.map((addr) => (addr.id === address.id ? { ...addr, ...address } : addr))
    : [address, ...normalized]

  setSavedAddresses(normalizeAddressList(next))
  return getSavedAddresses()
}

export function removeAddress(id) {
  const next = getSavedAddresses().filter((addr) => addr.id !== id)
  setSavedAddresses(normalizeAddressList(next))
  return getSavedAddresses()
}

export function findAddress(id) {
  return getSavedAddresses().find((addr) => addr.id === id) ?? null
}

export const deliveryMethods = [
  {
    id: 'platform',
    label: 'Platform Delivery',
    description: 'Delivered by Digital City Center logistics islandwide.',
    fee: 450,
    eta: '2–4 business days',
  },
  {
    id: 'pickup',
    label: 'Seller Pickup',
    description: 'Collect from the seller store when ready.',
    fee: 0,
    eta: 'Ready in 1–2 days',
  },
  {
    id: 'courier',
    label: 'Third-Party Courier',
    description: 'Express handoff to our courier partners.',
    fee: 650,
    eta: '1–2 business days',
  },
]

/** Buyer payment options per platform spec (8.3) */
export const paymentMethods = [
  {
    id: 'onepay',
    label: 'OnePay',
    description: 'Pay securely with OnePay — cards & bank apps.',
    online: true,
    gateway: 'onepay',
    accent: 'from-blue-600 to-blue-800',
  },
  {
    id: 'koko',
    label: 'Koko',
    description: 'Buy now, pay later with Koko instalments.',
    online: true,
    gateway: 'koko',
    accent: 'from-pink-500 to-rose-600',
  },
  {
    id: 'payhere',
    label: 'PayHere',
    description: 'Sri Lanka’s trusted PayHere checkout.',
    online: true,
    gateway: 'payhere',
    accent: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'mintpay',
    label: 'Mintpay',
    description: 'Fast checkout via Mintpay digital wallet.',
    online: true,
    gateway: 'mintpay',
    accent: 'from-violet-600 to-indigo-700',
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay with cash when your order is delivered.',
    online: false,
    gateway: null,
    accent: 'from-slate-600 to-slate-800',
  },
]

export function getPaymentMethod(id) {
  return paymentMethods.find((m) => m.id === id) ?? null
}

export function isOnlinePayment(methodId) {
  return getPaymentMethod(methodId)?.online ?? false
}

export function formatAddressLines(address) {
  const parts = [address.line1, address.line2, `${address.city}, ${address.district}`, address.postalCode]
  return parts.filter(Boolean)
}

export function getPlatformSettings() {
  try {
    const raw = localStorage.getItem('dcc_platform_settings')
    return raw ? JSON.parse(raw) : {
      platformName: 'Digital City Center',
      contactEmail: 'info@dcc.lk',
      baseFee: 450,
      outOfColomboFee: 200,
      supportedCountry: 'Sri Lanka',
      unsupportedKeywords: 'india, bengaluru, bangalore, chennai, delhi, mumbai, usa, united states, london, pakistan, bangladesh',
    }
  } catch {
    return {
      platformName: 'Digital City Center',
      contactEmail: 'info@dcc.lk',
      baseFee: 450,
      outOfColomboFee: 200,
      supportedCountry: 'Sri Lanka',
      unsupportedKeywords: 'india, bengaluru, bangalore, chennai, delhi, mumbai, usa, united states, london, pakistan, bangladesh',
    }
  }
}

export function getDeliveryFee(methodId, address) {
  const settings = getPlatformSettings()
  const base = methodId === 'courier' ? 650 : (methodId === 'pickup' ? 0 : Number(settings.baseFee ?? 450))
  if (methodId === 'pickup') return 0
  if (!address) return base

  const district = String(address.district || address.city || '').trim().toLowerCase()
  if (district && district !== 'colombo') {
    return base + Number(settings.outOfColomboFee ?? 200)
  }
  return base
}

export function generateOrderId() {
  const num = Math.floor(100000 + Math.random() * 900000)
  return `DCC-${num}`
}
