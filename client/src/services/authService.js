import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    if (res.data.token) {
      localStorage.setItem('imovies_token', res.data.token);
      localStorage.setItem('imovies_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(data) {
    const res = await api.post('/auth/login', data);
    if (res.data.token) {
      localStorage.setItem('imovies_token', res.data.token);
      localStorage.setItem('imovies_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('imovies_token');
      localStorage.removeItem('imovies_user');
    }
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data.user;
  },
};
