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

export const categoryAPI = {
  // Get all categories
  getCategories: async (type) => {
    const response = await api.get('/categories', {
      params: { type }
    });
    return response.data;
  },

  // Create a new category
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update a category
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete a category
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

export const transactionAPI = {
  // Get all transactions
  getTransactions: async (type) => {
    const response = await api.get('/transactions', {
      params: { type }
    });
    return response.data;
  },

  // Create a new transaction
  createTransaction: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  // Update a transaction
  updateTransaction: async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  // Delete a transaction
  deleteTransaction: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  // Get transactions by date
  getTransactionsByDate: async (date) => {
    const response = await api.get(`/transactions/date/${date}`);
    return response.data;
  },

  // Get transaction summary
  getTransactionSummary: async (period) => {
    const response = await api.get('/transactions/summary', {
      params: { period }
    });
    return response.data;
  }
};

export default api; 