import api from '../api/axios';

const extractData = (response) => response?.data ?? null;

export const fetchMyNotifications = async () => {
  const response = await api.get('/notifications/my');
  return extractData(response) || [];
};

export const fetchUnreadNotificationCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return extractData(response) ?? 0;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return extractData(response);
};

export const markAllNotificationsAsRead = async () => {
  await api.patch('/notifications/read-all');
};

export const deleteNotification = async (id) => {
  await api.delete(`/notifications/${id}`);
};

export const createTestNotification = async (payload = {}) => {
  const response = await api.post('/notifications/test', payload);
  return extractData(response);
};
