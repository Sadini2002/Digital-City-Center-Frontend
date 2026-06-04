import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function DeliveryWelcomeBanner({
  name,
  subtitle,
  primaryAction,
  secondaryAction,
}) {
  return (
    <section className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-white p-5 shadow-sm sm:p-6">
      <p className="text-sm font-medium text-dcc-primary">Welcome back</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Hi, {name}</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">{subtitle}</p>
      {(primaryAction || secondaryAction) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {primaryAction && (
            <Link
              to={primaryAction.to}
              className="inline-flex items-center gap-1.5 rounded-lg bg-dcc-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-dcc-primary-hover"
            >
              {primaryAction.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          {secondaryAction && (
            <Link
              to={secondaryAction.to}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </section>
  )
}
