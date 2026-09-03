export default function DeliverySegmentedControl({ options, value, onChange, className = '' }) {
  return (
    <div
      className={`inline-flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1 ${className}`}
      role="tablist"
    >
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              active
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {opt.label}
            {opt.badge != null && opt.badge > 0 ? (
              <span className="ml-1.5 rounded-full bg-dcc-primary/10 px-1.5 py-0.5 text-xs font-semibold text-dcc-primary">
                {opt.badge}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
