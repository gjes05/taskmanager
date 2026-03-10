import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getProjects = (userId) => API.get(`/projects/user/${userId}`);
export const createProject = (data) => API.post('/projects', data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const getTasksByProject = (projectId) => API.get(`/tasks/project/${projectId}`);
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const askAI = (action, context) => API.post('/ai/assist', { action, context });