import api from '../api/axios';

const extractData = (payload) => payload?.data ?? null;

export const fetchNotificationPreferences = async () => {
  const payload = await api.get('/preferences/notifications');
  return extractData(payload);
};

export const updateNotificationPreferences = async (preferences) => {
  const payload = await api.put('/preferences/notifications', preferences);
  return extractData(payload);
};
