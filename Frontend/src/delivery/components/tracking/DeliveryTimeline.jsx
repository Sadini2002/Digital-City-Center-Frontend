import { Check, Circle } from 'lucide-react'

export default function DeliveryTimeline({ steps = [], className = '' }) {
  if (!steps.length) {
    return <p className="text-sm text-slate-500">No timeline data yet.</p>
  }

  return (
    <ol className={`relative space-y-0 ${className}`}>
      {steps.map((step, index) => (
        <li key={step.status} className="flex gap-4 pb-8 last:pb-0">
          <div className="relative flex flex-col items-center">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                step.done
                  ? 'border-dcc-primary bg-dcc-primary text-white'
                  : step.current
                    ? 'border-dcc-primary bg-white text-dcc-primary'
                    : 'border-slate-200 bg-white text-slate-300'
              }`}
            >
              {step.done ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3 fill-current" />}
            </span>
            {index < steps.length - 1 && (
              <span className={`absolute top-8 h-full w-0.5 ${step.done ? 'bg-dcc-primary' : 'bg-slate-200'}`} />
            )}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p
              className={`text-sm font-medium ${
                step.current ? 'text-dcc-primary' : step.done ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              {step.label}
            </p>
            {step.timestamp && (
              <p className="text-xs text-slate-500">{new Date(step.timestamp).toLocaleString()}</p>
            )}
            {step.note && <p className="mt-0.5 text-xs text-slate-500">{step.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}
