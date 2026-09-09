import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'
import NotificationPanel from './NotificationPanel'
import { sellerApi } from '../../seller/services/sellerApi'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const loadUnreadCount = async () => {
    try {
      const response =
        await sellerApi.getUnreadNotificationCount()

      const count =
        response.data?.unreadCount ??
        response.data?.count ??
        0

      setUnreadCount(Number(count))
    } catch (error) {
      console.error(
        'Failed to load notification count:',
        error
      )
    }
  }

  useEffect(() => {
    loadUnreadCount()

    const interval = setInterval(() => {
      loadUnreadCount()
    }, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const handleNotificationsChanged = () => {
    loadUnreadCount()
  }

  return (
    <div className="relative">

      {/* Notification Bell */}
      <button
        type="button"
        onClick={() =>
          setOpen((previous) => !previous)
        }
        className="
          relative
          rounded-full
          p-2
          text-gray-600
          transition
          hover:bg-gray-100
          hover:text-gray-900
        "
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={21} />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              right-0
              top-0
              flex
              min-h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-red-500
              px-1
              text-[10px]
              font-bold
              text-white
            "
          >
            {unreadCount > 99
              ? '99+'
              : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {open && (
        <NotificationPanel
          onClose={() => setOpen(false)}
          onNotificationsChanged={
            handleNotificationsChanged
          }
        />
      )}

    </div>
  )
}