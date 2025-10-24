import axios from 'axios';

const api = axios.create({
  baseURL: '/api', 
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('scm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if ([401, 403].includes(err.response?.status)) {
      localStorage.removeItem('scm_token');
      localStorage.removeItem('scm_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
