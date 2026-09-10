import api from './api';

export const shelterService = {
  async getShelters(filters = {}) {
    const res = await api.get('/shelters', { params: filters });
    return res.data;
  },

  async getNearbyShelters(lat, lng) {
    const res = await api.get('/shelters/nearby', { params: { lat, lng } });
    return res.data;
  },

  async getShelterById(id) {
    const res = await api.get(`/shelters/${id}`);
    return res.data;
  },

  async createShelter(shelterData) {
    const res = await api.post('/shelters', shelterData);
    return res.data;
  },

  async updateOccupancy(id, updateData) {
    const res = await api.patch(`/shelters/${id}/occupancy`, updateData);
    return res.data;
  },
};
