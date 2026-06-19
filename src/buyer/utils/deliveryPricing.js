import { getPlatformSettings } from '../../admin/utils/adminStorage'

/** Approximate road distance (km) from the Colombo fulfillment hub. */
export const DISTRICT_DISTANCES_KM = {
  colombo: 5,
  gampaha: 25,
  kalutara: 40,
  negombo: 35,
  kandy: 115,
  kurunegala: 100,
  ratnapura: 100,
  matale: 140,
  galle: 120,
  matara: 160,
  badulla: 230,
  jaffna: 400,
}

const METHOD_SURCHARGES = {
  platform: 0,
  pickup: 0,
  courier: 200,
}

export function resolveDeliveryLocation(address) {
  if (!address) return ''
  return [address.district, address.city, address.line1, address.line2]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function getDeliveryDistanceKm(address) {
  const location = resolveDeliveryLocation(address)
  if (!location) return 10

  for (const [district, km] of Object.entries(DISTRICT_DISTANCES_KM)) {
    if (location.includes(district)) return km
  }

  let hash = 0
  for (let i = 0; i < location.length; i += 1) {
    hash += location.charCodeAt(i)
  }
  return 15 + (hash % 85)
}

export function calculateDeliveryFee({
  address,
  methodId = 'platform',
  subtotal = 0,
  settings = null,
} = {}) {
  if (methodId === 'pickup') {
    return { fee: 0, distanceKm: 0, model: 'pickup' }
  }

  const config = settings ?? getPlatformSettings()

  if (config.freeThreshold && subtotal >= Number(config.freeThreshold)) {
    return {
      fee: 0,
      distanceKm: getDeliveryDistanceKm(address),
      model: 'free',
    }
  }

  const methodSurcharge = METHOD_SURCHARGES[methodId] ?? 0

  if (config.pricingModel === 'flat') {
    return {
      fee: Number(config.flatFee || 0) + methodSurcharge,
      distanceKm: null,
      model: 'flat',
    }
  }

  const baseFee = Number(config.baseFee || 0)
  const perKmFee = Number(config.perKmFee || 0)
  const outOfColomboFee = Number(config.outOfColomboFee || 0)
  const distanceKm = getDeliveryDistanceKm(address)
  const location = resolveDeliveryLocation(address)
  const isColombo = location.includes('colombo')
  const surcharge = isColombo ? 0 : outOfColomboFee
  const fee = baseFee + distanceKm * perKmFee + surcharge + methodSurcharge

  return {
    fee: Math.round(fee),
    distanceKm,
    model: 'distance',
  }
}

export function getDeliveryFee(methodId, address, subtotal = 0) {
  return calculateDeliveryFee({ address, methodId, subtotal }).fee
}
