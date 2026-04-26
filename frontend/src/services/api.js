import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to attach our Mock Auth headers
api.interceptors.request.use(config => {
    const stored = localStorage.getItem('mockUser');
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Stored user from localStorage:', stored);
    
    if (stored) {
        const user = JSON.parse(stored);
        console.log('Parsed user object:', user);
        
        if (user) {
            config.headers['x-user-id'] = user.id;
            config.headers['x-user-email'] = user.email;
            config.headers['x-user-name'] = user.name;
            config.headers['x-user-role'] = user.role;
            console.log('Auth headers attached - Role:', user.role);
        }
    } else {
        console.warn('No mockUser found in localStorage!');
    }
    return config;
}, error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
});

export const bookingService = {
    createBooking: (data) => api.post('/bookings', data),
    getMyBookings: () => api.get('/bookings/my'),
    getAllBookings: (filters) => {
        console.log('getAllBookings called with filters:', filters);
        return api.get('/bookings', { params: filters });
    },
    getBookingById: (id) => api.get(`/bookings/${id}`),
    updateStatus: (id, status, rejectionReason) => api.put(`/bookings/${id}/status`, { status, rejectionReason }),
    cancelBooking: (id) => api.delete(`/bookings/${id}`),
    checkIn: (token) => api.post('/bookings/checkin', { token }),
    getAnalytics: () => {
        console.log('getAnalytics called');
        return api.get('/bookings/analytics');
    },
    checkAvailability: (resourceId, date, startTime, endTime) => 
        api.get('/bookings/check-availability', { params: { resourceId, date, startTime, endTime } })
};

// Response interceptor for better error logging
api.interceptors.response.use(
    response => {
        console.log('API Response Success:', response.config.url, 'Status:', response.status);
        return response;
    },
    error => {
        console.error('API Response Error:', error.config?.url);
        console.error('Error Status:', error.response?.status);
        console.error('Error Data:', error.response?.data);
        console.error('Error Message:', error.message);
        return Promise.reject(error);
    }
);

export const resourceService = {
    getResources: () => api.get('/resources')
};

export default api;
