import {
  DELIVERY_STATUS_META,
  DISPUTE_STATUS_META,
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
  humanize,
} from '../../utils/orderStatus'

const META_BY_KIND = {
  order: ORDER_STATUS_META,
  payment: PAYMENT_STATUS_META,
  delivery: DELIVERY_STATUS_META,
  dispute: DISPUTE_STATUS_META,
}

/**
 * kind: 'order' | 'payment' | 'delivery' | 'dispute'
 */
export default function StatusBadge({ kind = 'order', value }) {
  if (!value) {
    return <span className="text-xs text-slate-400">—</span>
  }
  const meta = META_BY_KIND[kind]?.[value]
  const label = meta?.label ?? humanize(value)
  const className = meta?.className ?? 'bg-slate-100 text-slate-700 ring-slate-200'

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${className}`}
    >
      {label}
    </span>
  )
}