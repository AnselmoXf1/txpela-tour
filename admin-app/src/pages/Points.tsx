import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Image } from 'lucide-react';
import { pontosService } from '../services/api';
import type { PontoTuristico } from '../types';
import EditImagesModal from '../components/EditImagesModal';

export default function Points() {
  const navigate = useNavigate();
  const [pontos, setPontos] = useState<PontoTuristico[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPonto, setEditingPonto] = useState<PontoTuristico | null>(null);

  useEffect(() => {
    loadPontos();
  }, []);

  const loadPontos = async () => {
    try {
      const response = await pontosService.getAll();
      setPontos(response.data);
    } catch (err) {
      console.error('Erro ao carregar pontos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este ponto?')) return;

    try {
      await pontosService.delete(id);
      alert('Ponto deletado com sucesso!');
      loadPontos();
    } catch (err) {
      console.error('Erro ao deletar:', err);
      alert('Erro ao deletar ponto');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-ocean border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Pontos Turísticos</h1>
          <p className="text-gray-600">Gerencie os pontos turísticos da plataforma</p>
        </div>
        <button
          onClick={() => navigate('/points/create')}
          className="bg-ocean text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Adicionar Ponto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagem</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviews</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pontos.map((ponto) => (
              <tr key={ponto._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {ponto.imagens[0] ? (
                    <img
                      src={ponto.imagens[0].url}
                      alt={ponto.nome}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{ponto.nome}</div>
                  <div className="text-sm text-gray-500 line-clamp-1">{ponto.descricao}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-ocean/10 text-ocean rounded-full text-xs font-bold">
                    {ponto.categoria}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {ponto.reviews?.length || 0} avaliações
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setEditingPonto(ponto)}
                    className="text-purple-600 hover:text-purple-800 mr-3"
                    title="Editar fotos"
                  >
                    <Image size={18} className="inline" />
                  </button>
                  <button
                    onClick={() => navigate(`/points/edit/${ponto._id}`)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                    title="Editar dados"
                  >
                    <Edit size={18} className="inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(ponto._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Deletar"
                  >
                    <Trash2 size={18} className="inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pontos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">Nenhum ponto turístico cadastrado</p>
            <button
              onClick={() => navigate('/points/create')}
              className="text-ocean hover:underline"
            >
              Adicionar o primeiro ponto
            </button>
          </div>
        )}
      </div>

      {/* Modal de edição de imagens */}
      {editingPonto && (
        <EditImagesModal
          ponto={editingPonto}
          onClose={() => setEditingPonto(null)}
          onUpdate={() => {
            loadPontos();
            setEditingPonto(null);
          }}
        />
      )}
    </div>
  );
}
