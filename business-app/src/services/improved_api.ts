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
  id: string;
  owner_id: string;
  owner_name: string;
  name: string;
  description: string;
  category: string;
  category_display: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
  };
  images: string[];
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  hours: string;
  price_range?: string;
  verified: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  business_id: string;
  business_name: string;
  business_avatar?: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_type: 'business' | 'user';
  content: string;
  images: string[];
  read: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  business_id: string;
  business_name: string;
  business_avatar?: string;
  title: string;
  content: string;
  images: string[];
  type: 'promotion' | 'event' | 'news' | 'menu' | 'service' | 'announcement';
  type_display: string;
  active: boolean;
  featured: boolean;
  views: number;
  likes: number;
  shares: number;
  user_liked: boolean;
  user_saved: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface Notification {
  id: string;
  user: string;
  business_id?: string;
  business_name?: string;
  type: string;
  type_display: string;
  title: string;
  message: string;
  data: any;
  read: boolean;
  created_at: string;
}

export interface AnalyticsOverview {
  overview: {
    views: number;
    messages: number;
    reviews: number;
    posts: number;
    growth: number;
    rating: number;
  };
  popular_posts: Post[];
  recent_conversations: Conversation[];
}

// Serviços de Autenticação
export const authService = {
  register: (data: any) => api.post('/business/register/', data),
  
  login: (email: string, password: string) => 
    api.post<{ token: string; refresh: string; business: Business; user: any }>('/business/login/', { email, password }),
  
  logout: () => {
    localStorage.removeItem('business_token');
    localStorage.removeItem('refresh_token');
  },
  
  refreshToken: (refresh: string) => 
    api.post('/token/refresh/', { refresh }),
};

// Serviços de Business
export const businessService = {
  getProfile: () => api.get<Business>('/businesses/mine/'),
  
  updateProfile: (data: Partial<Business>) => 
    api.put<Business>('/business/profile/', data),
  
  updateLocation: (lat: number, lng: number, address: string) =>
    api.put('/business/location/', { location: {
      type: 'Point',
      coordinates: [lng, lat],
      address
    }}),
  
  uploadImage: (image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('type', 'business');
    return api.post('/business/upload-image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Serviços de Conversas
export const conversationService = {
  getAll: () => api.get<Conversation[]>('/conversations/'),
  
  getById: (id: string) => api.get<Conversation>(`/conversations/${id}/`),
  
  getMessages: (id: string) => api.get<Message[]>(`/conversations/${id}/messages/`),
  
  sendMessage: (id: string, data: { content: string; images?: string[] }) =>
    api.post<Message>(`/conversations/${id}/send/`, data),
  
  markAsRead: (id: string) => api.post(`/conversations/${id}/read/`),
  
  startConversation: (businessId: string, message?: string) =>
    api.post<Conversation>(`/businesses/${businessId}/conversation/`, { message }),
};

// Serviços de Posts
export const postService = {
  getAll: (params?: { type?: string; active?: boolean }) => 
    api.get<Post[]>('/posts/', { params }),
  
  getById: (id: string) => api.get<Post>(`/posts/${id}/`),
  
  create: (data: Partial<Post>) => api.post<Post>('/posts/', data),
  
  update: (id: string, data: Partial<Post>) => api.put<Post>(`/posts/${id}/`, data),
  
  delete: (id: string) => api.delete(`/posts/${id}/`),
  
  like: (id: string) => api.post<{ liked: boolean; total_likes: number }>(`/posts/${id}/like/`),
  
  save: (id: string) => api.post<{ saved: boolean }>(`/posts/${id}/save/`),
  
  share: (id: string) => api.post<{ shared: boolean; total_shares: number }>(`/posts/${id}/share/`),
  
  uploadImages: (id: string, images: string[]) =>
    api.post(`/posts/${id}/upload-images/`, { images }),
  
  trackView: (id: string) => api.post(`/posts/${id}/view/`),
};

// Serviços de Notificações
export const notificationService = {
  getAll: () => api.get<Notification[]>('/notifications/'),
  
  markAsRead: (id: string) => api.post(`/notifications/${id}/read/`),
  
  markAllAsRead: () => api.post('/notifications/read-all/'),
};

// Serviços de Analytics
export const analyticsService = {
  getOverview: () => api.get<AnalyticsOverview>('/analytics/overview/'),
  
  getByPeriod: (period: 'week' | 'month' | 'year') =>
    api.get('/analytics/', { params: { period } }),
};

// Serviços Públicos (para app cliente)
export const publicService = {
  getPosts: (params?: { 
    type?: string; 
    category?: string; 
    business_id?: string;
    sort?: 'recent' | 'popular' | 'featured';
  }) => api.get<Post[]>('/public/posts/', { params }),
  
  getBusinesses: (params?: {
    category?: string;
    search?: string;
    near?: string;
    sort?: 'rating' | 'recent' | 'name';
  }) => api.get<Business[]>('/public/businesses/', { params }),
  
  trackBusinessView: (businessId: string) => 
    api.post(`/businesses/${businessId}/view/`),
  
  trackPostView: (postId: string) => 
    api.post(`/posts/${postId}/view/`),
};

// Utilitários
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getCoordinates = (location: Business['location']): [number, number] => {
  if (!location?.coordinates) return [-8.7619, 13.4527]; // Luanda default
  const [lng, lat] = location.coordinates;
  return [lat, lng];
};

export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};