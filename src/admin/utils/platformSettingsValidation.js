function pricingFieldError(value, label, { required = true } = {}) {
  const raw = String(value ?? '').trim()
  if (!raw) {
    return required ? `${label} is required.` : null
  }
  const num = Number(raw)
  if (Number.isNaN(num)) {
    return `${label} must be a valid number.`
  }
  if (num < 0) {
    return `${label} must be a non-negative number.`
  }
  return null
}

export function validatePlatformSettings(settings) {
  const errs = {}

  if (!settings.platformName?.trim()) {
    errs.platformName = 'Platform name is required.'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!settings.contactEmail?.trim()) {
    errs.contactEmail = 'Contact email is required.'
  } else if (!emailRegex.test(settings.contactEmail.trim())) {
    errs.contactEmail = 'Please enter a valid email address.'
  }

  if (!settings.pricingModel || !['distance', 'flat'].includes(settings.pricingModel)) {
    errs.pricingModel = 'Select a delivery pricing model.'
  }

  const baseFeeError = pricingFieldError(settings.baseFee, 'Base delivery fee')
  if (baseFeeError) errs.baseFee = baseFeeError

  const surchargeError = pricingFieldError(settings.outOfColomboFee, 'Out-of-Colombo surcharge')
  if (surchargeError) errs.outOfColomboFee = surchargeError

  if (settings.pricingModel === 'distance') {
    const perKmError = pricingFieldError(settings.perKmFee, 'Per-km rate')
    if (perKmError) errs.perKmFee = perKmError
  }

  if (settings.pricingModel === 'flat') {
    const flatFeeError = pricingFieldError(settings.flatFee, 'Flat delivery fee')
    if (flatFeeError) errs.flatFee = flatFeeError
  }

  const freeThresholdError = pricingFieldError(settings.freeThreshold, 'Free delivery threshold')
  if (freeThresholdError) errs.freeThreshold = freeThresholdError

  if (!settings.coverageAreas?.length) {
    errs.coverageAreas = 'At least one coverage area is required.'
  }

  return errs
}
