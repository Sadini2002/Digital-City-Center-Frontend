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
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Moneragala',
  'Ratnapura',
  'Kegalle',
]

export const PROVINCES = {
  'Western Province': ['Colombo', 'Gampaha', 'Kalutara'],
  'Central Province': ['Kandy', 'Matale', 'Nuwara Eliya'],
  'Southern Province': ['Galle', 'Matara', 'Hambantota'],
  'Northern Province': ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'],
  'Eastern Province': ['Batticaloa', 'Ampara', 'Trincomalee'],
  'North Western Province': ['Kurunegala', 'Puttalam'],
  'North Central Province': ['Anuradhapura', 'Polonnaruwa'],
  'Uva Province': ['Badulla', 'Moneragala'],
  'Sabaragamuwa Province': ['Ratnapura', 'Kegalle'],
}
