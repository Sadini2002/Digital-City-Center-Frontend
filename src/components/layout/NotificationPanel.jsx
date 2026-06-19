import { useEffect, useRef, useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import {
  getBuyerNotifications,
  getSellerNotifications,
  markBuyerNotificationsAsRead,
  markSellerNotificationsAsRead,
} from '../../utils/notificationStorage'
import { getNotifications, markAllNotificationsRead } from '../../delivery/utils/deliveryStorage'

export default function NotificationPanel({ role = 'buyer' }) {
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState([])
  const containerRef = useRef(null)

  const fetchNotifs = () => {
    if (role === 'buyer') {
      setNotifs(getBuyerNotifications())
    } else if (role === 'delivery') {
      const raw = getNotifications()
      const mapped = raw.map(n => ({
        id: n.id,
        title: n.title,
        message: n.body,
        read: n.read,
        createdAt: n.createdAt
      }))
      setNotifs(mapped)
    } else {
      setNotifs(getSellerNotifications())
    }
  }

  useEffect(() => {
    fetchNotifs()
    // Poll notifications every 5 seconds to keep it fresh
    const interval = setInterval(fetchNotifs, 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role])

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const unreadCount = notifs.filter((n) => !n.read).length

  const handleMarkAsRead = () => {
    if (role === 'buyer') {
      markBuyerNotificationsAsRead()
    } else if (role === 'delivery') {
      markAllNotificationsRead()
    } else {
      markSellerNotificationsAsRead()
    }
    fetchNotifs()
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-50 transition focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2.5 w-80 z-50 origin-top-right rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAsRead}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-dcc-primary hover:text-dcc-primary-hover hover:underline"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 pr-0.5">
            {notifs.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">No notifications yet.</p>
            ) : (
              notifs.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-lg p-2.5 text-left transition ${
                    n.read ? 'bg-white hover:bg-slate-50' : 'bg-violet-50/40 border border-violet-100/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <p className={`text-xs font-bold ${n.read ? 'text-slate-700' : 'text-slate-950'}`}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-dcc-primary mt-1" />
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500 leading-normal">{n.message}</p>
                  <p className="mt-1 text-[9px] text-slate-400 font-medium">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
