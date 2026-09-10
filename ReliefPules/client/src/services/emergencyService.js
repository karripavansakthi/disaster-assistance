import api from './api';

export const emergencyService = {
  async createRequest(data) {
    const res = await api.post('/emergency/create', data);
    return res.data;
  },

  async getAllRequests(filters = {}) {
    const res = await api.get('/emergency/all', { params: filters });
    return res.data;
  },

  async getMyRequests() {
    const res = await api.get('/emergency/my');
    return res.data;
  },

  async updateRequestStatus(id, updateData) {
    const res = await api.put(`/emergency/${id}/status`, updateData);
    return res.data;
  },
};
