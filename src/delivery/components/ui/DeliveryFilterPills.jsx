import { STATUS_LABELS } from '../DeliveryStatusBadge'

const FILTER_LABELS = {
  '': 'All statuses',
  ...STATUS_LABELS,
}

export default function DeliveryFilterPills({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
      {options.map((status) => {
        const active = value === status
        const label = FILTER_LABELS[status] ?? status.replace(/_/g, ' ')
        return (
          <button
            key={status || 'all'}
            type="button"
            onClick={() => onChange(status)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              active
                ? 'bg-dcc-primary text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
