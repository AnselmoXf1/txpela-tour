import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Heart, Bookmark, Share2 } from 'lucide-react';
import { pontosService } from '../services/api';
import type { PontoTuristico } from '../types';
import AnalyticsCard from '../components/AnalyticsCard';
import PointPreview from '../components/PointPreview';

export default function PointAnalytics() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [point, setPoint] = useState<PontoTuristico | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'feed' | 'explore'>('feed');

  useEffect(() => {
    if (id) {
      loadPoint(id);
    }
  }, [id]);

  const loadPoint = async (pointId: string) => {
    try {
      const response = await pontosService.getById(pointId);
      setPoint(response.data);
    } catch (err) {
      console.error('Erro ao carregar ponto:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!point) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Ponto não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/pontos')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{point.nome}</h1>
          <p className="text-gray-600">{point.descricao}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnalyticsCard
            title="Visualizações"
            value={0}
            icon={Eye}
            color="bg-blue-500"
            trend={{ value: 12, isPositive: true }}
          />
          <AnalyticsCard
            title="Curtidas"
            value={0}
            icon={Heart}
            color="bg-red-500"
            trend={{ value: 8, isPositive: true }}
          />
          <AnalyticsCard
            title="Salvos"
            value={0}
            icon={Bookmark}
            color="bg-green-500"
            trend={{ value: 3, isPositive: false }}
          />
          <AnalyticsCard
            title="Compartilhamentos"
            value={0}
            icon={Share2}
            color="bg-purple-500"
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preview</h2>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setViewMode('feed')}
              className={`px-4 py-2 rounded-lg ${
                viewMode === 'feed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Feed View
            </button>
            <button
              onClick={() => setViewMode('explore')}
              className={`px-4 py-2 rounded-lg ${
                viewMode === 'explore'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Explore View
            </button>
          </div>
          <PointPreview point={point} viewMode={viewMode} />
        </div>
      </div>
    </div>
  );
}
