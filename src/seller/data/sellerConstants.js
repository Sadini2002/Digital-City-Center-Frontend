export const SELLER_REGISTER_STEPS = [
  { id: 'business', label: 'Business Details' },
  { id: 'contact', label: 'Contact Information' },
  { id: 'approval', label: 'Approval Process' },
]

export const SELLER_BUSINESS_TYPES = ['Retailer', 'Wholesaler', 'Manufacturer', 'Service Provider']

export const SELLER_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Groceries',
  'Home & Living',
  'Beauty',
  'Sports',
  'Kids & Toys',
]

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

// ─────────────────────────────────────────────
// Seller order-item status machine
// Mirrors SELLER_ITEM_STATUS_FLOW on the backend
// (src/controllers/orderControllers.js).
// A seller only manages their own OrderItem rows;
// "dispatched" is the last stage owned by the seller —
// delivery/courier tracking takes over from there.
// ─────────────────────────────────────────────
export const SELLER_ORDER_STATUS_FLOW = {
  placed: ['confirmed', 'rejected'],
  confirmed: ['processing', 'rejected'],
  processing: ['ready_for_pickup', 'dispatched'],
  ready_for_pickup: ['dispatched'],
  dispatched: [],
  rejected: [],
  cancelled: [],
}

export const SELLER_ORDER_STATUS_LABELS = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  ready_for_pickup: 'Ready for Pickup',
  dispatched: 'Dispatched',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  mixed: 'Mixed',
}

// Action button copy for each possible transition target.
export const SELLER_ORDER_ACTION_LABELS = {
  confirmed: 'Confirm Order',
  rejected: 'Reject Order',
  processing: 'Start Processing',
  ready_for_pickup: 'Mark Ready for Pickup',
  dispatched: 'Mark Dispatched',
}

export const SELLER_ORDER_STATUS_FILTERS = [
  { value: 'all', label: 'All Orders' },
  { value: 'placed', label: 'Placed' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'ready_for_pickup', label: 'Ready for Pickup' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'rejected', label: 'Rejected' },
]
