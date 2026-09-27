import api from './api';

export const authService = {
  login: async (usernameOrEmail, password) => {
    try {
      const response = await api.post('/api/auth/login', { usernameOrEmail, password });
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('keyvault_token', response.data.data.token);
        localStorage.setItem('keyvault_user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Server connection failed. Using offline session fallback.' };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('keyvault_token', response.data.data.token);
        localStorage.setItem('keyvault_user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Registration failed.' };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('keyvault_token');
    localStorage.removeItem('keyvault_user');
  },

  getStoredUser: () => {
    const userStr = localStorage.getItem('keyvault_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};
