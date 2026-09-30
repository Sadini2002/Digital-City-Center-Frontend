import { STATUS_META } from '../../utils/Sellerstatus'

export default function SellerStatusBadge({ status }) {
  const key = String(status || 'pending').toLowerCase()
  const meta = STATUS_META[key] ?? STATUS_META.pending

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${meta.className}`}
    >
      {meta.label}
    </span>
  )
}