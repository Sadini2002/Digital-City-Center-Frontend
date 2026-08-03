import { Link, useNavigate } from 'react-router-dom'
import { CheckCheck, Bell } from 'lucide-react'
import NotificationItem from './NotificationItem'
import EmptyNotification from './EmptyNotification'

export default function NotificationDropdown({ notifications, unreadCount, onMarkAllRead, onClose, onItemClick }) {
  const navigate = useNavigate()
  const unreadNotifications = notifications.filter((notification) => !notification.read)
  const readNotifications = notifications.filter((notification) => notification.read)

  const handleItemOpen = (notification) => {
    onItemClick(notification)
    navigate(`/notifications/${notification.id}`)
    onClose()
  }

  return (
    <div className="absolute right-0 top-full z-50 mt-3 w-[24rem] origin-top-right overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/60 ring-1 ring-black/5">
      <div className="bg-gradient-to-r from-dcc-primary to-indigo-600 px-4 py-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85">
              <Bell className="h-3.5 w-3.5" />
              Inbox
            </div>
            <h3 className="mt-2 text-lg font-semibold">Notifications</h3>
            <p className="mt-1 text-sm text-white/75">Open a message or jump to the full inbox.</p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-white/25"
            >
              Mark all read
            </button>
          )}
        </div>

      </div>

      <div className="max-h-[25rem] space-y-2 overflow-y-auto bg-slate-50 px-3 py-3">
        {!notifications.length ? (
          <EmptyNotification />
        ) : (
          <>
            {unreadNotifications.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1 pt-1">
                  <span className="h-2 w-2 rounded-full bg-dcc-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">New</span>
                </div>
                {unreadNotifications.slice(0, 3).map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    compact
                    onClick={() => handleItemOpen(notification)}
                    onMarkRead={onItemClick}
                  />
                ))}
              </div>
            )}

            {readNotifications.length > 0 && (
              <div className="space-y-2">
                {unreadNotifications.length > 0 && (
                  <div className="flex items-center gap-2 px-1 pt-3">
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Earlier</span>
                  </div>
                )}
                {readNotifications.slice(0, 2).map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    compact
                    onClick={() => handleItemOpen(notification)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-4 py-3">
        <p className="text-xs text-slate-500">
          {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
        </p>
        <Link
          to="/notifications"
          onClick={onClose}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          View All
        </Link>
      </div>
    </div>
  )
}
