import { Ban, Check, RotateCcw, Trash2, X } from 'lucide-react'

export const STATUS_TABS = [
  { key: 'pending', label: 'Pending applications' },
  { key: 'approved', label: 'Approved' },
  { key: 'suspended', label: 'Suspended' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All sellers' },
  { key: 'removed', label: 'Removed' },
]

export const STATUS_KEYS = STATUS_TABS.map((tab) => tab.key)

export const STATUS_META = {
  pending: {
    label: 'Pending',
    className: 'bg-slate-100 text-slate-700 ring-slate-200',
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-rose-50 text-rose-700 ring-rose-200',
  },
  suspended: {
    label: 'Suspended',
    className: 'bg-amber-50 text-amber-800 ring-amber-200',
  },
  removed: {
    label: 'Removed',
    className: 'bg-slate-200 text-slate-600 ring-slate-300',
  },
}

/**
 * Every admin action a seller can receive.
 * `status` is the target status sent to PATCH /admin/sellers/:id/status.
 */
export const SELLER_ACTIONS = {
  approve: {
    key: 'approve',
    label: 'Approve',
    status: 'approved',
    icon: Check,
    variant: 'primary',
    needsReason: false,
    confirmTitle: 'Approve this seller?',
    confirmDescription: (shop) =>
      `${shop} will get access to the seller portal and receive an approval email.`,
    confirmLabel: 'Approve seller',
  },
  reject: {
    key: 'reject',
    label: 'Reject',
    status: 'rejected',
    icon: X,
    variant: 'danger-soft',
    needsReason: true,
    reasonLabel: 'Reason for rejection',
    reasonHelp: 'This reason is included in the email sent to the seller.',
    confirmTitle: 'Reject this application?',
    confirmDescription: (shop) =>
      `${shop} will be told their application was not approved.`,
    confirmLabel: 'Reject application',
  },
  suspend: {
    key: 'suspend',
    label: 'Suspend',
    status: 'suspended',
    icon: Ban,
    variant: 'warning',
    needsReason: true,
    reasonLabel: 'Reason for suspension',
    reasonHelp: 'This reason is included in the email sent to the seller.',
    confirmTitle: 'Suspend this seller?',
    confirmDescription: (shop) =>
      `${shop} will lose portal access and their live products will be hidden until you reinstate them.`,
    confirmLabel: 'Suspend seller',
  },
  reinstate: {
    key: 'reinstate',
    label: 'Reinstate',
    status: 'approved',
    icon: RotateCcw,
    variant: 'primary',
    needsReason: false,
    confirmTitle: 'Reinstate this seller?',
    confirmDescription: (shop) =>
      `${shop} will regain portal access and their hidden products will go live again.`,
    confirmLabel: 'Reinstate seller',
  },
  reconsider: {
    key: 'reconsider',
    label: 'Approve',
    status: 'approved',
    icon: Check,
    variant: 'primary',
    needsReason: false,
    confirmTitle: 'Approve this rejected application?',
    confirmDescription: (shop) =>
      `${shop} was previously rejected. Approving now gives them full seller access.`,
    confirmLabel: 'Approve seller',
  },
  remove: {
    key: 'remove',
    label: 'Remove',
    status: 'removed',
    icon: Trash2,
    variant: 'danger',
    needsReason: false,
    reasonLabel: 'Reason for removal (optional)',
    reasonHelp: 'If provided, it is included in the email sent to the seller.',
    reasonOptional: true,
    confirmTitle: 'Remove this seller?',
    confirmDescription: (shop) =>
      `${shop} will be permanently removed from the marketplace and cannot be restored from this screen.`,
    confirmLabel: 'Remove seller',
  },
}

/** Actions available for each status (must mirror the backend transition rules). */
export const ACTIONS_BY_STATUS = {
  pending: ['approve', 'reject'],
  approved: ['suspend', 'remove'],
  suspended: ['reinstate', 'remove'],
  rejected: ['reconsider', 'remove'],
  removed: [],
}

export function getSellerActions(status) {
  const keys = ACTIONS_BY_STATUS[String(status || '').toLowerCase()] ?? []
  return keys.map((key) => SELLER_ACTIONS[key])
}

export function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatLkr(amount) {
  return `LKR ${Number(amount || 0).toLocaleString('en-LK')}`
}

const ACTION_VARIANT_CLASSES = {
  primary:
    'bg-dcc-primary text-white hover:bg-dcc-primary-hover focus-visible:outline-dcc-primary',
  'danger-soft':
    'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 focus-visible:outline-rose-600',
  warning:
    'border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 focus-visible:outline-amber-600',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600',
}

export function getActionClasses(variant) {
  return ACTION_VARIANT_CLASSES[variant] ?? ACTION_VARIANT_CLASSES.primary
}