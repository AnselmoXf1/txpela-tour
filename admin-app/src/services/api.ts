import axios from 'axios';
import type { User, PontoTuristico, Stats } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Serviços
export const authService = {
  login: (username: string, password: string) => 
    api.post<{ token: string; user: User }>('/auth/login/', { username, password }),
  
  me: () => api.get<User>('/auth/me/'),
};

export const pontosService = {
  getAll: () => api.get<PontoTuristico[]>('/pontos-turisticos/'),
  
  getById: (id: string) => api.get<PontoTuristico>(`/pontos-turisticos/${id}/`),
  
  getStats: () => api.get<Stats>('/pontos-turisticos/stats/'),
  
  create: (formData: FormData) => {
    return api.post('/admin/pontos/create/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  update: (id: string, data: Partial<PontoTuristico> | FormData) => {
    const isFormData = data instanceof FormData;
    return api.patch(`/pontos-turisticos/${id}/update/`, data, {
      headers: isFormData ? {
        'Content-Type': 'multipart/form-data',
      } : undefined,
    });
  },
  
  delete: (id: string) => 
    api.delete(`/pontos-turisticos/${id}/delete/`),
  
  uploadImage: (id: string, formData: FormData) => {
    return api.post(`/pontos-turisticos/${id}/upload-image/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteImage: (id: string, publicId: string) => {
    const encodedPublicId = encodeURIComponent(publicId);
    return api.delete(`/pontos-turisticos/${id}/delete-image/${encodedPublicId}/`);
  },
};
