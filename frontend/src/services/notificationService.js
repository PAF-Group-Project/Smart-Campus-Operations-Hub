import api from '../api/axios';

const extractData = (payload) => payload?.data ?? null;

export const fetchMyNotifications = async () => {
  const payload = await api.get('/notifications/my');
  return extractData(payload) || [];
};

export const fetchUnreadNotificationCount = async () => {
  const payload = await api.get('/notifications/unread-count');
  return extractData(payload) ?? 0;
};

export const markNotificationAsRead = async (id) => {
  const payload = await api.patch(`/notifications/${id}/read`);
  return extractData(payload);
};

export const markAllNotificationsAsRead = async () => {
  await api.patch('/notifications/read-all');
};

export const deleteNotification = async (id) => {
  await api.delete(`/notifications/${id}`);
};

export const createTestNotification = async (payload = {}) => {
  const responsePayload = await api.post('/notifications/test', payload);
  return extractData(responsePayload);
};
