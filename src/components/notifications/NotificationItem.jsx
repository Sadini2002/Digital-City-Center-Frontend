import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, Circle, CheckCheck } from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatNotificationTime, getNotificationTone } from '../../utils/notificationUtils'

const toneStyles = {
  info: 'bg-sky-50 text-sky-700 ring-sky-100',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  warning: 'bg-amber-50 text-amber-700 ring-amber-100',
  error: 'bg-rose-50 text-rose-700 ring-rose-100',
}

export default function NotificationItem({
  notification,
  to,
  onClick,
  onMarkRead,
  compact = false,
  active = false,
}) {
  const tone = getNotificationTone(notification.type)
  const baseClassName = cn(
    'group flex w-full items-start gap-3 rounded-2xl border text-left transition focus:outline-none focus:ring-2 focus:ring-dcc-primary/20',
    compact ? 'p-3' : 'p-4',
    active
      ? 'border-dcc-primary bg-dcc-primary/5 shadow-sm'
      : notification.read
        ? 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
        : 'border-violet-200 bg-gradient-to-r from-violet-50/80 to-white hover:border-violet-300 hover:shadow-sm',
  )

  const content = (
    <>
      <span
        className={cn(
          'mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1',
          toneStyles[tone],
        )}
      >
        {notification.read ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3 fill-current" />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  'block text-sm font-semibold leading-tight',
                  notification.read ? 'text-slate-700' : 'text-slate-950',
                )}
              >
                {notification.title}
              </span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em]',
                  notification.read
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-dcc-primary/10 text-dcc-primary',
                )}
              >
                {notification.read ? 'Read' : 'New'}
              </span>
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-slate-600">{notification.message}</span>
          </span>
          {!notification.read && <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-dcc-primary" />}
        </span>

        <span className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <span>{formatNotificationTime(notification.createdAt)}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="capitalize">{notification.type || 'info'}</span>
        </span>
      </span>

      <div className="ml-auto flex shrink-0 items-center gap-2 self-center">
        {onMarkRead && !to && !notification.read && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onMarkRead(notification)
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-dcc-primary/30 hover:text-dcc-primary"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark read
          </button>
        )}

        <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-500" />
      </div>
    </>
  )

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={baseClassName}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={baseClassName}
    >
      {content}
    </button>
  )
}
