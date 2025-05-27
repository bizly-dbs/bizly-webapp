import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authAPI = {
  // Create User - exactly as per documentation
  register: async (userData) => {
    const response = await api.post('/users/create', {
      username: userData.name,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.password
    });
    return response.data;
  },

  // Login User - exactly as per documentation
  login: async (credentials) => {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    return response.data;
  },

  // Logout User
  logout: async () => {
    const response = await api.delete('/auth/logout');
    return response.data;
  }
};

export default api; 