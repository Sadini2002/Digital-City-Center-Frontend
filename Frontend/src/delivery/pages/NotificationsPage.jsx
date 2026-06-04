/** BACKEND: GET/PATCH/DELETE /delivery/notifications/* */
import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import deliveryApi from '../services/deliveryApi'
import DeliveryPanel from '../components/ui/DeliveryPanel'
import DeliveryEmptyState from '../components/ui/DeliveryEmptyState'
import { DeliveryBlockSkeleton } from '../components/ui/DeliverySkeleton'

export default function DeliveryNotificationsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    deliveryApi
      .listNotifications({ limit: 50 })
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const markRead = async (id) => {
    await deliveryApi.markNotificationRead(id)
    load()
  }

  const markAllRead = async () => {
    await deliveryApi.markAllNotificationsRead()
    load()
  }

  const remove = async (id) => {
    await deliveryApi.deleteNotification(id)
    load()
  }

  const unreadCount = items.filter((n) => !n.read).length

  return (
    <div className="space-y-5">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={markAllRead}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-dcc-primary shadow-sm hover:bg-slate-50"
          >
            Mark all as read ({unreadCount})
          </button>
        </div>
      )}

      {loading ? (
        <DeliveryBlockSkeleton className="h-48" />
      ) : !items.length ? (
        <DeliveryPanel>
          <DeliveryEmptyState
            icon={Bell}
            title="You're all caught up"
            description="New assignment and status alerts will appear here."
          />
        </DeliveryPanel>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => (
            <li
              key={n.id}
              className={`rounded-xl border p-4 shadow-sm transition ${
                n.read
                  ? 'border-slate-200 bg-white'
                  : 'border-violet-200 bg-gradient-to-r from-violet-50/80 to-white'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!n.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-dcc-primary" aria-hidden />
                    )}
                    <p className="font-semibold text-slate-900">{n.title}</p>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{n.body}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => markRead(n.id)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(n.id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-red-50 hover:text-red-700"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
