const DEFAULT_BLOCKED_KEYWORDS = [
  'india',
  'bengaluru',
  'bangalore',
  'mumbai',
  'delhi',
  'chennai',
  'hyderabad',
  'pakistan',
  'china',
  'united states',
  'usa',
  'united kingdom',
  'uk',
  'australia',
  'dubai',
  'uae',
]

export function normalizeAreaName(value) {
  return String(value ?? '').trim().toLowerCase()
}

export function isAddressInCoverage(address, coverageAreas) {
  if (!coverageAreas?.length) return true

  const city = normalizeAreaName(address?.city)
  const district = normalizeAreaName(address?.district)

  return coverageAreas.some((area) => {
    const normalized = normalizeAreaName(area)
    return (
      normalized === district ||
      normalized === city ||
      (district && district.includes(normalized)) ||
      (city && city.includes(normalized))
    )
  })
}

export function getCoverageStatus(address, settings) {
  const coverageAreas = settings?.coverageAreas || []
  const inCoverage = isAddressInCoverage(address, coverageAreas)
  const matchedArea = coverageAreas.find((area) => {
    const normalized = normalizeAreaName(area)
    const city = normalizeAreaName(address?.city)
    const district = normalizeAreaName(address?.district)
    return (
      normalized === district ||
      normalized === city ||
      (district && district.includes(normalized)) ||
      (city && city.includes(normalized))
    )
  })

  return { inCoverage, matchedArea: matchedArea || null, coverageAreas }
}

export function buildAddressSearchString(address) {
  return [
    address?.name,
    address?.line1,
    address?.line2,
    address?.city,
    address?.district,
    address?.postalCode,
    address?.country,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function getBlockedKeywords(settings) {
  const configured = (settings?.unsupportedKeywords || '')
    .split(',')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean)

  if (configured.length > 0) {
    return [...new Set(configured)]
  }

  return [...DEFAULT_BLOCKED_KEYWORDS]
}

export function validateDeliveryAddress(address, settings, { deliveryMethod = 'platform' } = {}) {
  if (!address?.name?.trim() || !address?.phone?.trim() || !address?.line1?.trim() || !address?.city?.trim()) {
    return {
      valid: false,
      error: 'Please complete your delivery address.',
      code: 'incomplete',
    }
  }

  const addressString = buildAddressSearchString(address)
  const blockedKeywords = getBlockedKeywords(settings)

  for (const keyword of blockedKeywords) {
    if (addressString.includes(keyword)) {
      return {
        valid: false,
        error: `Delivery is not available to this location. Addresses containing "${keyword}" are outside our Sri Lanka service area.`,
        code: 'unsupported_keyword',
        keyword,
      }
    }
  }

  if (deliveryMethod !== 'pickup') {
    const coverage = settings?.coverageAreas || []
    if (coverage.length > 0 && !isAddressInCoverage(address, coverage)) {
      return {
        valid: false,
        error: `Delivery is not supported in ${address.district || address.city}. We only deliver to: ${coverage.join(', ')}.`,
        code: 'outside_coverage',
      }
    }
  }

  return { valid: true, error: '', code: 'ok' }
}

export function isAddressCompleteEnoughForDeliveryCheck(address) {
  return Boolean(address?.line1?.trim() && address?.city?.trim())
}
