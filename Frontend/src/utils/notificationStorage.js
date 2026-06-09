const BUYER_NOTIFS_KEY = 'dcc_buyer_notifications'
const SELLER_NOTIFS_KEY = 'dcc_seller_notifications'

function readJson(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeJson(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

export function getBuyerNotifications() {
  const notifs = readJson(BUYER_NOTIFS_KEY)
  // If empty, seed with some welcome notifications
  if (notifs.length === 0) {
    const seed = [
      {
        id: 'n-buyer-1',
        title: 'Welcome to DCC!',
        message: 'Explore products, select categories, and shop safely.',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
      }
    ]
    writeJson(BUYER_NOTIFS_KEY, seed)
    return seed
  }
  return notifs
}

export function addBuyerNotification(title, message, type = 'info') {
  const notifs = getBuyerNotifications()
  const newNotif = {
    id: `n-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  }
  writeJson(BUYER_NOTIFS_KEY, [newNotif, ...notifs])
  return newNotif
}

export function markBuyerNotificationsAsRead() {
  const notifs = getBuyerNotifications()
  const updated = notifs.map((n) => ({ ...n, read: true }))
  writeJson(BUYER_NOTIFS_KEY, updated)
}

export function getSellerNotifications() {
  const notifs = readJson(SELLER_NOTIFS_KEY)
  if (notifs.length === 0) {
    const seed = [
      {
        id: 'n-seller-1',
        title: 'Welcome to Seller Center!',
        message: 'Add products, update inventory, and manage your shop orders.',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
      }
    ]
    writeJson(SELLER_NOTIFS_KEY, seed)
    return seed
  }
  return notifs
}

export function addSellerNotification(title, message, type = 'info') {
  const notifs = getSellerNotifications()
  const newNotif = {
    id: `n-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  }
  writeJson(SELLER_NOTIFS_KEY, [newNotif, ...notifs])
  return newNotif
}

export function markSellerNotificationsAsRead() {
  const notifs = getSellerNotifications()
  const updated = notifs.map((n) => ({ ...n, read: true }))
  writeJson(SELLER_NOTIFS_KEY, updated)
}
