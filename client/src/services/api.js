import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
};

export const projectAPI = {
  getAll: () => api.get('/projects'),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  // UNSTOPPABLE PROTOCOL: Using POST for delete
  delete: (id) => api.post(`/projects/${id}/delete`),
};

export const taskAPI = {
  getAll: () => api.get('/tasks'),
  getStats: () => api.get('/tasks/stats'),
  create: (data) => api.post('/tasks', data),
  updateStatus: (id, status) => api.put(`/tasks/${id}/status`, { status }),
  // UNSTOPPABLE PROTOCOL: Using POST for delete
  delete: (id) => api.post(`/tasks/${id}/delete`),
};

export const userAPI = {
  getAll: () => api.get('/users'),
};

export default api;
