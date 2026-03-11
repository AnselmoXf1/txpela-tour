import React, { useEffect, useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { statsService } from '../services/api';
import { Eye, MessageSquare, FileText, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { business } = useBusiness();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await statsService.getOverview();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Eye, label: 'Visualizações', value: stats?.views || 0, color: 'blue' },
    { icon: MessageSquare, label: 'Mensagens', value: stats?.messages || 0, color: 'green' },
    { icon: FileText, label: 'Posts Ativos', value: stats?.posts || 0, color: 'purple' },
    { icon: TrendingUp, label: 'Crescimento', value: `${stats?.growth || 0}%`, color: 'orange' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bem-vindo, {business?.name}</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-${card.color}-50`}>
                      <Icon className={`text-${card.color}-600`} size={24} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Atividade Recente</h2>
              <div className="space-y-3">
                {stats?.recent_activity?.length > 0 ? (
                  stats.recent_activity.map((activity: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <p className="text-sm text-gray-700">{activity.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Nenhuma atividade recente</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Status do Perfil</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Perfil Completo</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    business?.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {business?.verified ? 'Verificado' : 'Pendente'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Localização</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    business?.location ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {business?.location ? 'Configurada' : 'Não configurada'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
