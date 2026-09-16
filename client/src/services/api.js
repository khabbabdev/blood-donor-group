import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (identifier, password) => api.post('/auth/login', { identifier, password }),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email, identifier: email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  uploadAvatar: (formData) => api.post('/upload/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const donorAPI = {
  getAll: (params) => api.get('/donors', { params }),
  getById: (id) => api.get(`/donors/${id}`),
  getByBloodGroup: (group) => api.get(`/donors/group/${encodeURIComponent(group)}`),
  getStats: () => api.get('/donors/stats'),
  toggleAvailability: (id) =>
    id ? api.patch(`/donors/${id}/availability`) : api.patch('/donors/availability'),
  create: (data) => api.post('/donors', data),
  update: (id, data) => api.put(`/donors/${id}`, data),
  remove: (id) => api.delete(`/donors/${id}`),
};

export const bloodRequestAPI = {
  create: (data) => api.post('/blood-requests', data),
  getAll: (params) => api.get('/blood-requests', { params }),
  getMine: () => api.get('/blood-requests/me'),
  update: (id, data) => api.put(`/blood-requests/${id}`, data),
};

export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getStats: () => api.get('/admin/stats'),
  approve: (id) => api.patch(`/admin/users/${id}/approve`),
  ban: (id) => api.patch(`/admin/users/${id}/ban`),
  getPending: () => api.get('/admin/users/pending'),
};

export const contactAPI = {
  send: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  markAsRead: (id) => api.put(`/contact/${id}/read`),
};

export const donationAPI = {
  create: (data) => api.post('/donations', data),
  getMyDonations: () => api.get('/donations/me'),
  getAllDonations: () => api.get('/donations'),
  verifyDonation: (id, status) => api.put(`/donations/${id}/verify`, { status }),
  update: (id, data) => api.put(`/donations/${id}`, data),
  delete: (id) => api.delete(`/donations/${id}`),
};

export default api;
