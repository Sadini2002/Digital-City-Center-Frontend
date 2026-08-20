const styles = {
  placed: 'bg-indigo-50 text-indigo-700 ring-indigo-200/80',
  confirmed: 'bg-violet-50 text-violet-700 ring-violet-200/80',
  processing: 'bg-amber-50 text-amber-700 ring-amber-200/80',
  dispatched: 'bg-sky-50 text-sky-700 ring-sky-200/80',
  shipped: 'bg-sky-50 text-sky-700 ring-sky-200/80',
  out_for_delivery: 'bg-cyan-50 text-cyan-700 ring-cyan-200/80',
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80',
  cancelled: 'bg-slate-100 text-slate-700 ring-slate-200/80',
  payment_failed: 'bg-rose-50 text-rose-700 ring-rose-200/80',
  rejected: 'bg-red-50 text-red-700 ring-red-200/80',
}

export default function StatusBadge({ status }) {
  const key = String(status ?? '').toLowerCase()
  const className = styles[key] ?? 'bg-slate-100 text-slate-700 ring-slate-200/80'

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ${className}`}>
      {status ? String(status).replace(/_/g, ' ') : 'UNKNOWN'}
    </span>
  )
}
