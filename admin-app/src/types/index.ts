export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

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

export interface Stats {
  total_pontos: number;
  total_praias: number;
  total_restaurantes: number;
  total_hoteis: number;
  total_pousadas: number;
  total_reviews: number;
  avg_rating: number;
}
