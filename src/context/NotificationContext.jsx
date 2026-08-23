import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import notificationApi from "../services/notificationApi";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * Convert backend notification format
   * to frontend notification format.
   */
  const normalizeNotification = useCallback((notification) => {
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      link: notification.link,
      read: notification.isRead,
      createdAt: notification.createdAt,
    };
  }, []);

  /**
   * Fetch all notifications
   */
  const refresh = useCallback(async () => {
    try {
      setLoading(true);

      const response = await notificationApi.getNotifications();

      const data = response.notifications || [];

      const mapped = data.map(normalizeNotification);

      setNotifications(mapped);

      setUnreadCount(
        mapped.filter((notification) => !notification.read).length
      );
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error
      );

      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [normalizeNotification]);

  /**
   * Mark one notification as read
   */
  const markRead = useCallback(async (id) => {
    try {
      await notificationApi.markAsRead(id);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );

      setUnreadCount((current) =>
        Math.max(0, current - 1)
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  }, []);

  /**
   * Delete notification
   */
  const deleteNotification = useCallback(async (id) => {
    try {
      await notificationApi.deleteNotification(id);

      setNotifications((current) =>
        current.filter(
          (notification) => notification.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error
      );
    }
  }, []);

  /**
   * Initial load + polling
   */
  useEffect(() => {
    refresh();

    const interval = setInterval(() => {
      refresh();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [refresh]);

  const value = {
    notifications,
    unreadCount,
    loading,
    refresh,
    markRead,
    markAllRead,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationsContext() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotificationsContext must be used inside NotificationProvider"
    );
  }

  return context;
}