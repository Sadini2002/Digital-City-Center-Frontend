export const ORDER_STATUS_META = {
  placed: { label: 'Placed', className: 'bg-slate-100 text-slate-700 ring-slate-200' },
  confirmed: { label: 'Confirmed', className: 'bg-violet-50 text-dcc-primary ring-violet-200' },
  processing: { label: 'Processing', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  ready_for_pickup: { label: 'Ready for pickup', className: 'bg-sky-50 text-sky-700 ring-sky-200' },
  dispatched: { label: 'Dispatched', className: 'bg-sky-50 text-sky-700 ring-sky-200' },
  shipped: { label: 'Shipped', className: 'bg-sky-50 text-sky-700 ring-sky-200' },
  delivered: { label: 'Delivered', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  cancelled: { label: 'Cancelled', className: 'bg-rose-50 text-rose-700 ring-rose-200' },
  rejected: { label: 'Rejected', className: 'bg-rose-50 text-rose-700 ring-rose-200' },
  refunded: { label: 'Refunded', className: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200' },
}

export const PAYMENT_STATUS_META = {
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  paid: { label: 'Paid', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  failed: { label: 'Failed', className: 'bg-rose-50 text-rose-700 ring-rose-200' },
  refunded: { label: 'Refunded', className: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200' },
  partially_refunded: {
    label: 'Partially refunded',
    className: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
  },
}

export const DELIVERY_STATUS_META = {
  CONFIRMED: { label: 'Awaiting driver', className: 'bg-slate-100 text-slate-700 ring-slate-200' },
  PROCESSING: { label: 'Assigned', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  DISPATCHED: { label: 'Picked up', className: 'bg-sky-50 text-sky-700 ring-sky-200' },
  OUT_FOR_DELIVERY: { label: 'Out for delivery', className: 'bg-sky-50 text-sky-700 ring-sky-200' },
  DELIVERED: { label: 'Delivered', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  CANCELLED: { label: 'Cancelled', className: 'bg-rose-50 text-rose-700 ring-rose-200' },
}

export const DISPUTE_STATUS_META = {
  open: { label: 'Open', className: 'bg-rose-50 text-rose-700 ring-rose-200' },
  under_review: { label: 'Under review', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  resolved: { label: 'Resolved', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  rejected: { label: 'Dismissed', className: 'bg-slate-100 text-slate-600 ring-slate-200' },
}

export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS_META).map(([value, meta]) => ({
  value,
  label: meta.label,
}))

export const PAYMENT_STATUS_OPTIONS = Object.entries(PAYMENT_STATUS_META).map(([value, meta]) => ({
  value,
  label: meta.label,
}))

/** Statuses that void an order, so the admin must write a reason. */
export const ORDER_STATUSES_NEEDING_REASON = ['cancelled', 'rejected', 'refunded']
export const PAYMENT_STATUSES_NEEDING_REASON = ['failed', 'refunded', 'partially_refunded']

export const DISPUTE_RESOLUTIONS = [
  {
    value: 'refund_buyer',
    label: 'Refund buyer in full',
    help: 'Marks the payment refunded. If the order is not delivered yet it is also cancelled and stock is returned.',
  },
  {
    value: 'partial_refund',
    label: 'Partial refund',
    help: 'Refund part of the order total. The order itself is left as it is.',
  },
  {
    value: 'release_seller',
    label: 'Decide in seller’s favour',
    help: 'No money moves. The seller keeps the payment.',
  },
  {
    value: 'dismissed',
    label: 'Dismiss dispute',
    help: 'The dispute is invalid or withdrawn. Closed with no further action.',
  },
]

export const ACTIVITY_LABELS = {
  status_override: 'Order status changed',
  payment_override: 'Payment status changed',
  delivery_assigned: 'Delivery assigned',
  dispute_opened: 'Dispute opened',
  dispute_status: 'Dispute status changed',
  dispute_resolved: 'Dispute resolved',
}

export function humanize(value) {
  return String(value ?? '')
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
}

export function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-LK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' })
}