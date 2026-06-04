import { DELIVERY_STATUSES, GPS_ACTIVE_STATUSES, TERMINAL_DELIVERY_STATUSES } from '../data/constants'

/** Map legacy mock/UI statuses → PDF backend statuses */
const LEGACY_TO_CANONICAL = {
  PENDING: 'CONFIRMED',
  ACCEPTED: 'PROCESSING',
  PICKED_UP: 'DISPATCHED',
  ON_THE_WAY: 'OUT_FOR_DELIVERY',
  FAILED: 'CANCELLED',
  RETURNED: 'CANCELLED',
}

export function normalizeDeliveryStatus(status) {
  if (!status) return status
  return LEGACY_TO_CANONICAL[status] ?? status
}

const NEXT_ACTIONS = {
  CONFIRMED: [{ status: 'PROCESSING', label: 'Accept delivery', variant: 'primary' }],
  PROCESSING: [
    { status: 'DISPATCHED', label: 'Mark picked up', variant: 'primary' },
    { status: 'CANCELLED', label: 'Mark failed', variant: 'danger' },
  ],
  DISPATCHED: [
    { status: 'OUT_FOR_DELIVERY', label: 'On the way', variant: 'primary' },
    { status: 'CANCELLED', label: 'Mark failed', variant: 'danger' },
  ],
  OUT_FOR_DELIVERY: [
    { status: 'DELIVERED', label: 'Mark delivered', variant: 'primary' },
    { status: 'CANCELLED', label: 'Mark failed', variant: 'danger' },
  ],
}

export function getNextActions(currentStatus) {
  return NEXT_ACTIONS[normalizeDeliveryStatus(currentStatus)] || []
}

export function isPoolStatus(status) {
  const n = normalizeDeliveryStatus(status)
  return n === 'CONFIRMED' || status === 'PENDING'
}

export function isActiveStatus(status) {
  const n = normalizeDeliveryStatus(status)
  return ['PROCESSING', 'DISPATCHED', 'OUT_FOR_DELIVERY'].includes(n)
}

export function isGpsActiveStatus(status) {
  const n = normalizeDeliveryStatus(status)
  return GPS_ACTIVE_STATUSES.includes(n) || ['PICKED_UP', 'ON_THE_WAY'].includes(status)
}

export function isTerminalStatus(status) {
  const n = normalizeDeliveryStatus(status)
  return TERMINAL_DELIVERY_STATUSES.includes(n) || ['FAILED', 'RETURNED'].includes(status)
}

export function isAwaitingAccept(status) {
  const n = normalizeDeliveryStatus(status)
  return n === 'CONFIRMED' || status === 'PENDING'
}

export { DELIVERY_STATUSES, LEGACY_TO_CANONICAL }
export default NEXT_ACTIONS
