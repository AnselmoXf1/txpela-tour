import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('business_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tipos
export interface Business {
  _id: string;
  owner_id: string;
  name: string;
  description: string;
  category: 'restaurant' | 'hotel' | 'tour_guide' | 'shop' | 'service';
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
  };
  images: Array<{
    url: string;
    public_id: string;
  }>;
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  hours: string;
  price_range?: string;
  verified: boolean;
  created_at: string;
}

export interface Message {
  _id: string;
  business_id: string;
  user_id: string;
  user_name: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Post {
  _id: string;
  business_id: string;
  title: string;
  content: string;
  images: string[];
  type: 'promotion' | 'event' | 'news';
  active: boolean;
  created_at: string;
}

// Serviços
export const businessService = {
  register: (data: any) => api.post('/business/register/', data),
  login: (email: string, password: string) => 
    api.post<{ token: string; business: Business }>('/business/login/', { email, password }),
  getProfile: () => api.get<Business>('/business/profile/'),
  updateProfile: (data: Partial<Business>) => api.put('/business/profile/', data),
  updateLocation: (lat: number, lng: number, address: string) =>
    api.put('/business/location/', { lat, lng, address }),
};

export const messageService = {
  getAll: () => api.get<Message[]>('/business/messages/'),
  markAsRead: (id: string) => api.put(`/business/messages/${id}/read/`),
  reply: (id: string, content: string) => 
    api.post(`/business/messages/${id}/reply/`, { content }),
};

export const postService = {
  getAll: () => api.get<Post[]>('/business/posts/'),
  create: (data: Partial<Post>) => api.post('/business/posts/', data),
  update: (id: string, data: Partial<Post>) => api.put(`/business/posts/${id}/`, data),
  delete: (id: string) => api.delete(`/business/posts/${id}/`),
  toggleActive: (id: string) => api.put(`/business/posts/${id}/toggle/`),
};

export const statsService = {
  getOverview: () => api.get('/business/stats/overview/'),
  getViews: (period: 'week' | 'month' | 'year') => 
    api.get(`/business/stats/views/?period=${period}`),
};
