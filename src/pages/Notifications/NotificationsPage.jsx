import { useEffect, useMemo } from 'react'
import { Bell, Clock3, Filter, Inbox, Sparkles } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import useNotifications from '../../hooks/useNotifications'
import NotificationItem from '../../components/notifications/NotificationItem'
import EmptyNotification from '../../components/notifications/EmptyNotification'
import { formatNotificationTime } from '../../utils/notificationUtils'

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { id: selectedId } = useParams()
  const { notifications, unreadCount, markRead, markAllRead, refresh } = useNotifications()

  useEffect(() => {
    refresh()
  }, [refresh])

  const selectedNotification = useMemo(() => {
    if (!notifications.length) return null
    return notifications.find((notification) => notification.id === selectedId) ?? notifications[0]
  }, [notifications, selectedId])

  const unreadNotifications = notifications.filter((notification) => !notification.read)
  const readNotifications = notifications.filter((notification) => notification.read)

  const handleSelect = (notification) => {
    markRead(notification.id)
    navigate(`/notifications/${notification.id}`)
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_36%),linear-gradient(180deg,_rgba(248,250,252,0.95),_rgba(255,255,255,0))]" />

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-dcc-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-dcc-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Notifications hub
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Stay on top of every update</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Review the latest alerts, jump into the full notification view, and keep unread items visible until they are handled.
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Filter className="h-4 w-4" />
              Mark all as read {unreadCount > 0 ? `(${unreadCount})` : ''}
            </button>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)]">
          <section className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Unread</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">{unreadCount}</p>
                <p className="mt-1 text-sm text-slate-500">Needs attention now</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">{notifications.length}</p>
                <p className="mt-1 text-sm text-slate-500">Messages in your inbox</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Read</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">{readNotifications.length}</p>
                <p className="mt-1 text-sm text-slate-500">Already handled</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Inbox</h2>
                  <p className="mt-0.5 text-sm text-slate-500">Open a notification to mark it as read and move it to the read section.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  <Inbox className="h-3.5 w-3.5" />
                  {notifications.length} items
                </div>
              </div>

              <div className="space-y-6 p-4 sm:p-5">
                {notifications.length === 0 ? (
                  <EmptyNotification />
                ) : (
                  <>
                    {unreadNotifications.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-dcc-primary" />
                          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">New</h3>
                        </div>
                        <div className="space-y-3">
                          {unreadNotifications.map((notification) => (
                            <NotificationItem
                              key={notification.id}
                              notification={notification}
                              to={`/notifications/${notification.id}`}
                              active={selectedNotification?.id === notification.id}
                              onClick={() => handleSelect(notification)}
                              onMarkRead={markRead}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {readNotifications.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-slate-300" />
                          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Earlier</h3>
                        </div>
                        <div className="space-y-3">
                          {readNotifications.map((notification) => (
                            <NotificationItem
                              key={notification.id}
                              notification={notification}
                              to={`/notifications/${notification.id}`}
                              active={selectedNotification?.id === notification.id}
                              onClick={() => handleSelect(notification)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
