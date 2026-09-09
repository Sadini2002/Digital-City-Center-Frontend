import {
  Bell,
  Check,
  CheckCheck,
  Loader2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { sellerApi } from '../services/sellerApi'

function formatDate(date) {
  if (!date) {
    return ''
  }

  const value = new Date(date)

  if (Number.isNaN(value.getTime())) {
    return ''
  }

  return value.toLocaleString()
}

function getIcon(type) {
  switch (String(type || '').toLowerCase()) {
    case 'new_order':
      return '🛒'
    case 'order':
      return '📦'
    case 'payment':
      return '💰'
    case 'listing':
      return '🏷️'
    case 'approval':
      return '✅'
    case 'warning':
      return '⚠️'
    default:
      return '🔔'
  }
}

export default function SellerNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [markingAll, setMarkingAll] = useState(false)

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError('')

      const response =
        await sellerApi.getNotifications()

      const data = response.data

      const list =
        data?.notifications ||
        data?.data ||
        (Array.isArray(data) ? data : [])

      setNotifications(list)
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
          'Failed to load notifications.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const markAsRead = async (id) => {
    try {
      await sellerApi.markNotificationAsRead(id)

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                read: true,
                isRead: true,
              }
            : notification
        )
      )
    } catch (err) {
      console.error(
        'Failed to mark notification:',
        err
      )
    }
  }

  const markAllAsRead = async () => {
    try {
      setMarkingAll(true)

      await sellerApi.markAllNotificationsAsRead()

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read: true,
          isRead: true,
        }))
      )
    } catch (err) {
      console.error(
        'Failed to mark all notifications:',
        err
      )
    } finally {
      setMarkingAll(false)
    }
  }

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.read &&
      !notification.isRead
  ).length

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bell size={23} />

            <h1 className="text-2xl font-bold text-gray-900">
              Notifications
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Stay updated with your shop activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={markingAll}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {markingAll ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <CheckCheck size={16} />
            )}

            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2
            size={30}
            className="animate-spin text-gray-500"
          />
        </div>
      ) : error ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-red-500">{error}</p>

          <button
            type="button"
            onClick={loadNotifications}
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
          >
            Try Again
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <div className="text-4xl">🔔</div>

          <h2 className="mt-3 font-semibold text-gray-900">
            No notifications yet
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            New orders and seller updates will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white">
          {notifications.map((notification) => {
            const isRead =
              notification.read ||
              notification.isRead

            return (
              <div
                key={notification.id}
                className={[
                  'flex gap-4 border-b p-5 last:border-b-0',
                  isRead
                    ? 'bg-white'
                    : 'bg-blue-50',
                ].join(' ')}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl">
                  {getIcon(notification.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3
                        className={
                          isRead
                            ? 'font-medium text-gray-800'
                            : 'font-semibold text-gray-900'
                        }
                      >
                        {notification.title ||
                          'Notification'}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        {notification.message ||
                          notification.body ||
                          ''}
                      </p>
                    </div>

                    {!isRead && (
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {formatDate(
                        notification.createdAt
                      )}
                    </span>

                    {!isRead && (
                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                        className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                      >
                        <Check size={14} />
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}