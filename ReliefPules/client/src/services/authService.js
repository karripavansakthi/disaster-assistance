import api from './api';

export const authService = {
  async register(userData) {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  async getProfile() {
    const res = await api.get('/user/profile');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/user/profile', profileData);
    return res.data;
  },
};
