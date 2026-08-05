import { api } from './api/client'
import { getAuthToken } from '../utils/authStorage'

import {
  addBuyerNotification,
  getBuyerNotifications,
  markBuyerNotificationsAsRead,
} from '../utils/notificationStorage'

const NOTIFICATION_EVENT = 'dcc:buyer-notifications-changed'

function emitChange() {
  window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENT))
}

export function getNotifications() {
  return getBuyerNotifications()
}

export function getUnreadNotificationCount() {
  return getBuyerNotifications().filter((notification) => !notification.read).length
}

export function markNotificationAsRead(id) {
  const notifications = getBuyerNotifications().map((notification) =>
    notification.id === id ? { ...notification, read: true } : notification,
  )
  localStorage.setItem('dcc_buyer_notifications', JSON.stringify(notifications))
  emitChange()
  return notifications.find((notification) => notification.id === id) ?? null
}

export function markAllNotificationsAsRead() {
  markBuyerNotificationsAsRead()
  emitChange()
}

export function createNotification(title, message, type = 'info') {
  const notification = addBuyerNotification(title, message, type)
  emitChange()
  return notification
}

export function subscribeToNotificationChanges(handler) {
  window.addEventListener(NOTIFICATION_EVENT, handler)
  window.addEventListener('storage', handler)

  return () => {
    window.removeEventListener(NOTIFICATION_EVENT, handler)
    window.removeEventListener('storage', handler)
  }
}
