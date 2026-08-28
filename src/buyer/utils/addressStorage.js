import { savedAddresses as initialSavedAddresses } from '../data/checkoutData'

const ADDRESSES_KEY = 'dcc_saved_addresses'

/**
 * Get all saved addresses from localStorage merged with initial default addresses.
 */
export function getSavedAddresses() {
  try {
    const raw = localStorage.getItem(ADDRESSES_KEY)
    if (!raw) {
      // Seed initial addresses if none exist yet
      localStorage.setItem(ADDRESSES_KEY, JSON.stringify(initialSavedAddresses))
      return initialSavedAddresses
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : initialSavedAddresses
  } catch (err) {
    console.error('Failed to read saved addresses from storage:', err)
    return initialSavedAddresses
  }
}

/**
 * Save a new address to localStorage and return the new address list.
 */
export function saveAddress(newAddr) {
  const currentList = getSavedAddresses()
  
  const createdAddress = {
    id: newAddr.id || `addr-${Date.now()}`,
    label: newAddr.label || 'Home',
    name: newAddr.name || newAddr.fullName || 'Valued Customer',
    phone: newAddr.phone || '',
    line1: newAddr.line1 || newAddr.addressLine || '',
    line2: newAddr.line2 || '',
    city: newAddr.city || '',
    district: newAddr.district || newAddr.city || '',
    postalCode: newAddr.postalCode || '',
    isDefault: currentList.length === 0,
  }

  // Prepend new address to saved list
  const updatedList = [createdAddress, ...currentList]
  
  try {
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(updatedList))
  } catch (err) {
    console.error('Failed to save address to localStorage:', err)
  }

  return { createdAddress, updatedList }
}

/**
 * Delete a saved address by ID.
 */
export function deleteAddress(addressId) {
  const currentList = getSavedAddresses()
  const updatedList = currentList.filter((addr) => addr.id !== addressId)
  
  try {
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(updatedList))
  } catch (err) {
    console.error('Failed to delete address from localStorage:', err)
  }

  return updatedList
}
