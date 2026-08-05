import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  subscribeToNotificationChanges,
} from '../services/notificationService'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => getNotifications())

  const refresh = useCallback(() => {
    setNotifications(getNotifications())
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToNotificationChanges(refresh)
    return unsubscribe
  }, [refresh])

  const markRead = useCallback((id) => {
    const updated = markNotificationAsRead(id)
    if (updated) refresh()
    return updated
  }, [refresh])

  const markAllRead = useCallback(() => {
    markAllNotificationsAsRead()
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: getUnreadNotificationCount(),
      refresh,
      markRead,
      markAllRead,
    }),
    [notifications, refresh, markAllRead, markRead],
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotificationsContext() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationsContext must be used within NotificationProvider')
  }
  return context
}
