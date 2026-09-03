import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

const VARIANTS = {
  error: {
    className: 'border-red-200 bg-red-50 text-red-800',
    Icon: AlertCircle,
  },
  success: {
    className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    Icon: CheckCircle2,
  },
  info: {
    className: 'border-violet-200 bg-violet-50 text-violet-900',
    Icon: Info,
  },
}

export default function DeliveryAlert({ variant = 'info', title, children }) {
  const { className, Icon } = VARIANTS[variant] || VARIANTS.info
  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${className}`} role="alert">
      <Icon className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2} />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? 'mt-0.5 opacity-90' : ''}>{children}</div>
      </div>
    </div>
  )
}
