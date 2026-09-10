import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rp_token') || localStorage.getItem('reliefpulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please check network connection.';
    return Promise.reject(new Error(message));
  }
);

// ── Emergency Requests API ──
export const emergencyAPI = {
  create: (data) => api.post('/emergency', data),
  getAll: (params) => api.get('/emergency', { params }),
  getMine: () => api.get('/emergency/my'),
  getById: (id) => api.get(`/emergency/${id}`),
  updateStatus: (id, data) => api.patch(`/emergency/${id}/status`, data),
  getStats: () => api.get('/emergency/stats'),
};

// ── Shelters API ──
export const shelterAPI = {
  getAll: (params) => api.get('/shelters', { params }),
  getNearby: (lat, lng) => api.get('/shelters/nearby', { params: { lat, lng } }),
  getAiRecommendations: (lat, lng, peopleCount = 1, needMedical = false) =>
    api.get('/shelters/ai-recommendation', {
      params: { lat, lng, peopleCount, needMedical },
    }),
  getById: (id) => api.get(`/shelters/${id}`),
  create: (data) => api.post('/shelters', data),
  updateOccupancy: (id, data) => api.patch(`/shelters/${id}/occupancy`, data),
};

// ── Alerts API ──
export const alertAPI = {
  getAll: (params) => api.get('/alerts', { params }),
  create: (data) => api.post('/alerts', data),
};

// ── Medical / Hospitals API ──
export const medicalAPI = {
  getAll: (params) => api.get('/medical', { params }),
};

// ── Resources API ──
export const resourceAPI = {
  getAll: (params) => api.get('/resources', { params }),
};

// ── Rescue Teams API ──
export const rescueTeamAPI = {
  getAll: (params) => api.get('/rescue-teams', { params }),
};

// ── Auth API ──
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export default api;
