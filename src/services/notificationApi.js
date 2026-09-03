import { api } from "./api/client";

const notificationApi = {
  /**
   * Get all notifications
   */
  async getNotifications() {
    const response = await api.get("/notifications");

    return response.data;
  },

  /**
   * Get unread notifications
   */
  async getUnreadNotifications() {
    const response = await api.get("/notifications/unread");

    return response.data;
  },

  /**
   * Get unread count
   */
  async getUnreadCount() {
    const response = await api.get("/notifications/count");

    return response.data;
  },

  /**
   * Mark one notification as read
   */
  async markAsRead(id) {
    const response = await api.patch(
      `/notifications/${id}/read`
    );

    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    const response = await api.patch(
      "/notifications/read-all"
    );

    return response.data;
  },

  /**
   * Delete notification
   */
  async deleteNotification(id) {
    const response = await api.delete(
      `/notifications/${id}`
    );

    return response.data;
  },
};

export default notificationApi;