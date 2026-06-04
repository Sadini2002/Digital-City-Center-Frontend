export default function DeliveryStatCard({ label, value, tone = 'default', icon: Icon }) {
  const valueTone =
    tone === 'success'
      ? 'text-emerald-600'
      : tone === 'danger'
        ? 'text-red-600'
        : tone === 'brand'
          ? 'text-dcc-primary'
          : 'text-slate-900'

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-100 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className={`mt-1.5 text-2xl font-bold tracking-tight ${valueTone}`}>{value}</p>
        </div>
        {Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-dcc-primary">
            <Icon className="h-5 w-5" strokeWidth={2} />
          </span>
        )}
      </div>
    </div>
  )
}
