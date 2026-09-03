import { normalizeDeliveryStatus } from '../utils/deliveryStatus'

const STATUS_STYLES = {
  CONFIRMED: 'bg-amber-100 text-amber-800',
  PENDING: 'bg-amber-100 text-amber-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  DISPATCHED: 'bg-indigo-100 text-indigo-800',
  PICKED_UP: 'bg-indigo-100 text-indigo-800',
  OUT_FOR_DELIVERY: 'bg-cyan-100 text-cyan-800',
  ON_THE_WAY: 'bg-cyan-100 text-cyan-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800',
  FAILED: 'bg-red-100 text-red-800',
  RETURNED: 'bg-slate-100 text-slate-700',
}

const STATUS_LABELS = {
  CONFIRMED: 'Confirmed',
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  ACCEPTED: 'Accepted',
  DISPATCHED: 'Dispatched',
  PICKED_UP: 'Picked up',
  OUT_FOR_DELIVERY: 'Out for delivery',
  ON_THE_WAY: 'On the way',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  FAILED: 'Failed',
  RETURNED: 'Returned',
}

export default function DeliveryStatusBadge({ status, className = '' }) {
  const canonical = normalizeDeliveryStatus(status)
  const label = STATUS_LABELS[status] ?? STATUS_LABELS[canonical] ?? String(status || '').replace(/_/g, ' ')
  const styleKey = STATUS_STYLES[status] ? status : canonical

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ring-black/5 ${
        STATUS_STYLES[styleKey] || 'bg-slate-100 text-slate-700'
      } ${className}`}
    >
      {label}
    </span>
  )
}

export { STATUS_LABELS }
