import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../utils/api/client";
import { getAuthToken } from "../utils/authStorage";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/notifications");

      const data = response.data;

      const backendNotifications = Array.isArray(
        data?.notifications
      )
        ? data.notifications
        : [];

      const mappedNotifications = backendNotifications.map(
        (notification) => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type?.toLowerCase() || "info",
          link: notification.link,
          read: notification.isRead,
          createdAt: notification.createdAt,
        })
      );

      setNotifications(mappedNotifications);

      setUnreadCount(
        mappedNotifications.filter(
          (notification) => !notification.read
        ).length
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
  }, []);

  const refresh = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  const markRead = useCallback(
    async (notificationId) => {
      try {
        await api.patch(
          `/notifications/${notificationId}/read`
        );

        setNotifications((current) =>
          current.map((notification) =>
            notification.id === notificationId
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
    },
    []
  );

  const markAllRead = useCallback(async () => {
    try {
      await api.patch("/notifications/read-all");

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

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    loading,
    refresh,
    markRead,
    markAllRead,
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