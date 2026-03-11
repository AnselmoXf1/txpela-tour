import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tipos
export interface PontoTuristico {
  _id: string;
  nome: string;
  descricao: string;
  categoria: string;
  localizacao: {
    type: 'Point';
    coordinates: [number, number];
  };
  imagens: Array<{
    url: string;
    public_id: string;
    alt: string;
  }>;
  reviews?: Array<{
    usuario: string;
    rating: number;
    comentario: string;
    data: string;
  }>;
  preco_medio?: number;
  horario_funcionamento?: string;
  contato?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  response: string;
}

export interface RecommendationsResponse {
  explanation: string;
  recommendations: PontoTuristico[];
}

export interface Post {
  id: number;
  business_id: number;
  business_name: string;
  title: string;
  content: string;
  images: string[];
  type: 'promotion' | 'event' | 'news';
  active: boolean;
  created_at: string;
}

export interface Business {
  id: number;
  name: string;
  description: string;
  category: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  hours: string;
  price_range?: string;
  verified: boolean;
}

// Serviços
export const pontosTuristicosService = {
  getAll: () => api.get<PontoTuristico[]>('/pontos-turisticos/'),
  getById: (id: string) => api.get<PontoTuristico>(`/pontos-turisticos/${id}/`),
  search: (query: string) => 
    api.get<PontoTuristico[]>(`/pontos-turisticos/search/?q=${encodeURIComponent(query)}`),
  getNearby: (lat: number, lng: number, maxDistance: number = 5000) => 
    api.get<PontoTuristico[]>(`/pontos-turisticos/nearby/?lat=${lat}&lng=${lng}&max_distance=${maxDistance}`),
  addReview: (pontoId: string, rating: number, comentario: string) =>
    api.post(`/pontos-turisticos/${pontoId}/review/`, { rating, comentario }),
};

export const aiService = {
  chat: (messages: ChatMessage[]) => 
    api.post<ChatResponse>('/ai/chat/', { messages }),
  getRecommendations: (preferences: string) => 
    api.post<RecommendationsResponse>('/ai/recommendations/', { preferences }),
};

export const authService = {
  login: (username: string, password: string) => 
    api.post<{ token: string; user: any }>('/auth/login/', { username, password }),
  register: (data: { name: string; email: string; password: string }) => {
    const [firstName, ...lastNameParts] = data.name.split(' ');
    const lastName = lastNameParts.join(' ');
    return api.post<{ token: string; user: any }>('/auth/register/', {
      username: data.email.split('@')[0],
      email: data.email,
      password: data.password,
      first_name: firstName,
      last_name: lastName || '',
    });
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

export const postsService = {
  getAll: (type?: 'promotion' | 'event' | 'news') => {
    const url = type ? `/posts/?type=${type}` : '/posts/';
    return api.get<Post[]>(url);
  },
};

export const businessesService = {
  getAll: (category?: string) => {
    const url = category ? `/businesses/?category=${category}` : '/businesses/';
    return api.get<Business[]>(url);
  },
  sendMessage: (businessId: number, content: string) =>
    api.post(`/businesses/${businessId}/message/`, { content }),
  trackView: (businessId: number) =>
    api.post(`/businesses/${businessId}/view/`),
};

// Helpers
export const calculateAverageRating = (reviews?: Array<{ rating: number }>) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

export const getLatLng = (ponto: PontoTuristico): [number, number] => {
  const [lng, lat] = ponto.localizacao.coordinates;
  return [lat, lng];
};
