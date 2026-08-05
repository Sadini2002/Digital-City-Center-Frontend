import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { cn } from '../../utils/cn'
import useNotifications from '../../hooks/useNotifications'
import NotificationBadge from './NotificationBadge'
import NotificationDropdown from './NotificationDropdown'

export default function NotificationBell({ className }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleItemClick = (notification) => {
    if (!notification.read) {
      markRead(notification.id)
    }
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'relative inline-flex rounded-lg p-2 text-slate-600 transition hover:bg-slate-50 hover:text-dcc-primary focus:outline-none focus:ring-2 focus:ring-dcc-primary/20',
          className,
        )}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" strokeWidth={1.75} />
        <NotificationBadge count={unreadCount} />
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={() => markAllRead()}
          onItemClick={handleItemClick}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}
