import {
  Check,
  CheckCheck,
  Loader2,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { sellerApi } from '../services/sellerApi'

function formatNotificationDate(date) {
  if (!date) {
    return ''
  }

  const value = new Date(date)

  if (Number.isNaN(value.getTime())) {
    return ''
  }

  return value.toLocaleString()
}

function getNotificationIcon(type) {
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

export default function NotificationPanel({
  onClose,
  onNotificationsChanged,
}) {
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingId, setMarkingId] = useState(null)
  const [markingAll, setMarkingAll] = useState(false)
  const [error, setError] = useState('')

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError('')

      const response =
        await sellerApi.getNotifications()

      const data = response.data

      const notificationList =
        data?.notifications ||
        data?.data ||
        (Array.isArray(data) ? data : [])

      setNotifications(notificationList)
    } catch (err) {
      console.error(
        'Failed to load seller notifications:',
        err
      )

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

  const handleNotificationClick = async (
    notification
  ) => {
    if (!notification?.id) {
      return
    }

    try {
      setMarkingId(notification.id)

      const isRead =
        notification.read ||
        notification.isRead

      // Mark as read first if necessary
      if (!isRead) {
        await sellerApi.markNotificationAsRead(
          notification.id
        )

        setNotifications((previous) =>
          previous.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  read: true,
                  isRead: true,
                }
              : item
          )
        )

        onNotificationsChanged?.()
      }

      // Close dropdown
      onClose?.()

      // Navigate to the full notifications page
      navigate('/seller/notifications')
    } catch (err) {
      console.error(
        'Failed to handle notification click:',
        err
      )
    } finally {
      setMarkingId(null)
    }
  }

  const handleMarkAllAsRead = async () => {
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

      onNotificationsChanged?.()
    } catch (err) {
      console.error(
        'Failed to mark all notifications as read:',
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
    <div
      className="
        absolute
        right-0
        top-12
        z-50
        w-[360px]
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-xl
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            Notifications
          </h3>

          <p className="text-xs text-gray-500">
            {unreadCount > 0
              ? `${unreadCount} unread`
              : 'All caught up'}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
              className="
                rounded-lg
                p-2
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-900
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              title="Mark all as read"
            >
              {markingAll ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <CheckCheck size={17} />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-900
            "
            aria-label="Close notifications"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div className="max-h-[420px] overflow-y-auto">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2
              size={24}
              className="animate-spin text-gray-500"
            />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={loadNotifications}
              className="
                mt-3
                rounded-lg
                bg-gray-900
                px-4
                py-2
                text-sm
                text-white
                transition
                hover:bg-gray-800
              "
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          notifications.length === 0 && (
            <div className="px-4 py-10 text-center">
              <div className="text-3xl">
                🔔
              </div>

              <p className="mt-2 text-sm font-medium text-gray-700">
                No notifications
              </p>

              <p className="mt-1 text-xs text-gray-500">
                New orders and updates will appear here.
              </p>
            </div>
          )}

        {/* Notifications */}
        {!loading &&
          !error &&
          notifications.length > 0 &&
          notifications.map((notification) => {
            const isRead =
              notification.read ||
              notification.isRead

            const isMarking =
              markingId === notification.id

            return (
              <button
                key={notification.id}
                type="button"
                disabled={isMarking}
                onClick={() =>
                  handleNotificationClick(
                    notification
                  )
                }
                className={[
                  'flex w-full gap-3 border-b px-4 py-3 text-left transition',
                  'cursor-pointer',
                  'disabled:cursor-not-allowed',
                  isRead
                    ? 'bg-white hover:bg-gray-50'
                    : 'bg-blue-50 hover:bg-blue-100',
                  isMarking
                    ? 'opacity-70'
                    : '',
                ].join(' ')}
              >
                {/* Icon */}
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-gray-100
                    text-lg
                  "
                >
                  {getNotificationIcon(
                    notification.type
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={[
                        'text-sm',
                        isRead
                          ? 'font-medium text-gray-700'
                          : 'font-semibold text-gray-900',
                      ].join(' ')}
                    >
                      {notification.title ||
                        'Notification'}
                    </p>

                    {!isRead && (
                      <span
                        className="
                          mt-1
                          h-2
                          w-2
                          shrink-0
                          rounded-full
                          bg-blue-600
                        "
                      />
                    )}
                  </div>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-gray-600
                    "
                  >
                    {notification.message ||
                      notification.body ||
                      ''}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">
                      {formatNotificationDate(
                        notification.createdAt
                      )}
                    </span>

                    {isMarking ? (
                      <Loader2
                        size={14}
                        className="animate-spin text-gray-500"
                      />
                    ) : !isRead ? (
                      <Check
                        size={14}
                        className="text-gray-400"
                      />
                    ) : null}
                  </div>
                </div>
              </button>
            )
          })}
      </div>
    </div>
  )
}