/** Validates Sri Lankan contact numbers: 0XXXXXXXXX or +94XXXXXXXXX (9 digits after country code). */
export function isValidContactNumber(value) {
  const digits = String(value || '').replace(/[\s\-()]/g, '')
  if (!digits) return false
  if (/^\+94[1-9]\d{8}$/.test(digits)) return true
  if (/^0[1-9]\d{8}$/.test(digits)) return true
  return false
}

export function contactNumberError(value) {
  if (!String(value || '').trim()) return 'Contact number is required.'
  if (!isValidContactNumber(value)) {
    return 'Enter a valid Sri Lankan contact number (e.g. 0771234567 or +94771234567).'
  }
  return ''
}
