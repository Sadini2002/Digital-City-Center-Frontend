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

export function getDeliveryFee(methodId) {
  return deliveryMethods.find((m) => m.id === methodId)?.fee ?? 450
}

export function generateOrderId() {
  const num = Math.floor(100000 + Math.random() * 900000)
  return `DCC-${num}`
}
