import { useEffect, useState } from 'react';
import { MapPin, Users, Star, MessageCircle } from 'lucide-react';
import { pontosService } from '../services/api';
import type { Stats } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await pontosService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-ocean border-t-transparent"></div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total de Pontos',
      value: stats?.total_pontos || 0,
      icon: MapPin,
      color: 'bg-ocean',
      textColor: 'text-ocean',
    },
    {
      title: 'Praias',
      value: stats?.total_praias || 0,
      icon: MapPin,
      color: 'bg-tropical',
      textColor: 'text-tropical',
    },
    {
      title: 'Total de Reviews',
      value: stats?.total_reviews || 0,
      icon: MessageCircle,
      color: 'bg-sun',
      textColor: 'text-sun',
    },
    {
      title: 'Rating Médio',
      value: stats?.avg_rating?.toFixed(1) || '0.0',
      icon: Star,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{card.title}</p>
              <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Distribuição por Categoria</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Praias</span>
              <span className="font-bold text-ocean">{stats?.total_praias || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Restaurantes</span>
              <span className="font-bold text-tropical">{stats?.total_restaurantes || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Hotéis</span>
              <span className="font-bold text-sun">{stats?.total_hoteis || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pousadas</span>
              <span className="font-bold text-yellow-600">{stats?.total_pousadas || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <a
              href="/points"
              className="block w-full bg-ocean text-white py-3 rounded-lg text-center font-bold hover:bg-blue-700 transition"
            >
              Gerenciar Pontos
            </a>
            <a
              href="/users"
              className="block w-full bg-tropical text-white py-3 rounded-lg text-center font-bold hover:bg-green-700 transition"
            >
              Gerenciar Usuários
            </a>
            <a
              href="http://localhost:8000/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gray-600 text-white py-3 rounded-lg text-center font-bold hover:bg-gray-700 transition"
            >
              Django Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
