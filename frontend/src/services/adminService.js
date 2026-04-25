import api from '../api/axios';

const extractData = (payload) => payload?.data ?? null;

export const fetchAdminStats = async () => {
  const payload = await api.get('/admin/stats');
  return extractData(payload);
};
