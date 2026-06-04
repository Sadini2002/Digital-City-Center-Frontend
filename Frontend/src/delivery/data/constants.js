export const ROLES = {
  DELIVERY_PROVIDER: 'DELIVERY_PROVIDER',
  DELIVERY_DRIVER: 'DELIVERY_DRIVER',
}

/** Backend PDF contract — Delivery Management status values */
export const DELIVERY_STATUSES = [
  'CONFIRMED',
  'PROCESSING',
  'DISPATCHED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
]

export const ACTIVE_DELIVERY_STATUSES = ['PROCESSING', 'DISPATCHED', 'OUT_FOR_DELIVERY']

export const GPS_ACTIVE_STATUSES = ['DISPATCHED', 'OUT_FOR_DELIVERY']

export const TERMINAL_DELIVERY_STATUSES = ['DELIVERED', 'CANCELLED']

export const DISTRICTS = [
  'Colombo',
  'Gampaha',
  'Kandy',
  'Galle',
  'Matara',
  'Jaffna',
  'Kurunegala',
]
