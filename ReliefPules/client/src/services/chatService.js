import api from './api';

export const chatService = {
  async sendMessage(message, sessionId) {
    const res = await api.post('/chat/message', { message, sessionId });
    return res.data;
  },

  async getChatHistory(sessionId) {
    const params = sessionId ? { sessionId } : {};
    const res = await api.get('/chat/history', { params });
    return res.data;
  },

  async getChatSession(sessionId) {
    const res = await api.get(`/chat/session/${sessionId}`);
    return res.data;
  },

  async deleteChatSession(sessionId) {
    const res = await api.delete(`/chat/session/${sessionId}`);
    return res.data;
  },
};
