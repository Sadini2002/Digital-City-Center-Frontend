import { Link } from 'react-router-dom'

export default function DashboardCard({ title, value, hint, icon: Icon, to }) {
  const content = (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition">{title}</p>
        <p className="mt-1.5 text-2xl font-bold text-slate-900 group-hover:text-dcc-primary transition">{value}</p>
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </div>
      {Icon ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-dcc-primary transition-all duration-300 group-hover:bg-dcc-primary group-hover:text-white">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
      ) : null}
    </div>
  )

  const cardStyle = "group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-dcc-primary/30 hover:shadow-md hover:-translate-y-0.5 block"

  if (to) {
    return (
      <Link to={to} className={cardStyle}>
        {content}
      </Link>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">{value}</p>
          {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
        </div>
        {Icon ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-dcc-primary">
            <Icon className="h-4 w-4" strokeWidth={2} />
          </span>
        ) : null}
      </div>
    </div>
  )
}
