import api from './api';

export const alertService = {
  async getActiveAlerts() {
    const res = await api.get('/alerts/active');
    return res.data;
  },

  async getStats() {
    const res = await api.get('/alerts/stats');
    return res.data;
  },
};
