import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle global errors e.g. 401 Unauthorized
    if (error.response?.status === 401) {
      // Possible redirect to login or refresh token logic
    }
    return Promise.reject(error);
  }
);

export default api;
