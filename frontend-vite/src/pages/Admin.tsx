import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2, Image as ImageIcon, X, BarChart3, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface PontoTuristico {
  _id: string;
  nome: string;
  descricao: string;
  categoria: string;
  localizacao: {
    coordinates: [number, number];
  };
  imagens: Array<{
    url: string;
    public_id: string;
  }>;
  preco_medio?: number;
  horario_funcionamento?: string;
  contato?: string;
}

interface Stats {
  total_pontos: number;
  total_praias: number;
  total_restaurantes: number;
  total_hoteis: number;
  total_pousadas: number;
  total_reviews: number;
  avg_rating: number;
}

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pontos, setPontos] = useState<PontoTuristico[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPonto, setEditingPonto] = useState<PontoTuristico | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: 'praia',
    latitude: '',
    longitude: '',
    preco_medio: '',
    horario_funcionamento: '',
    contato: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Verifica se o usuário é admin
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!user.is_staff) {
      alert('Você não tem permissão para acessar o painel admin.');
      navigate('/', { replace: true });
      return;
    }

    // Admin pode acessar diretamente ou via easter egg
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      const [pontosRes, statsRes] = await Promise.all([
        api.get('/admin-panel/pontos/'),
        api.get('/admin-panel/stats/')
      ]);
      setPontos(pontosRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      alert('Erro ao carregar dados. Verifique se você tem permissão de admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nome', formData.nome);
      formDataToSend.append('descricao', formData.descricao);
      formDataToSend.append('categoria', formData.categoria);
      formDataToSend.append('latitude', formData.latitude);
      formDataToSend.append('longitude', formData.longitude);
      formDataToSend.append('preco_medio', formData.preco_medio || '0');
      formDataToSend.append('horario_funcionamento', formData.horario_funcionamento);
      formDataToSend.append('contato', formData.contato);

      if (selectedFiles) {
        Array.from(selectedFiles).forEach((file) => {
          formDataToSend.append('imagens', file);
        });
      }

      if (editingPonto) {
        await api.put(`/admin-panel/pontos/${editingPonto._id}/`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Ponto turístico atualizado com sucesso!');
      } else {
        await api.post('/admin-panel/pontos/create/', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Ponto turístico criado com sucesso!');
      }

      setShowModal(false);
      resetForm();
      loadData();
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      alert(err.response?.data?.error || 'Erro ao salvar ponto turístico');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este ponto turístico?')) return;

    try {
      await api.delete(`/admin-panel/pontos/${id}/delete/`);
      alert('Ponto turístico deletado com sucesso!');
      loadData();
    } catch (err) {
      console.error('Erro ao deletar:', err);
      alert('Erro ao deletar ponto turístico');
    }
  };

  const handleDeleteImage = async (pontoId: string, publicId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta imagem?')) return;

    try {
      await api.delete(`/admin-panel/pontos/${pontoId}/images/${publicId}/`);
      alert('Imagem deletada com sucesso!');
      loadData();
    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
      alert('Erro ao deletar imagem');
    }
  };

  const openEditModal = (ponto: PontoTuristico) => {
    setEditingPonto(ponto);
    setFormData({
      nome: ponto.nome,
      descricao: ponto.descricao,
      categoria: ponto.categoria,
      latitude: ponto.localizacao.coordinates[1].toString(),
      longitude: ponto.localizacao.coordinates[0].toString(),
      preco_medio: ponto.preco_medio?.toString() || '',
      horario_funcionamento: ponto.horario_funcionamento || '',
      contato: ponto.contato || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      categoria: 'praia',
      latitude: '',
      longitude: '',
      preco_medio: '',
      horario_funcionamento: '',
      contato: ''
    });
    setSelectedFiles(null);
    setEditingPonto(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-heading font-bold">Painel Admin</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-ocean text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Novo Ponto
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-ocean" size={32} />
                <div>
                  <p className="text-gray-500 text-sm">Total de Pontos</p>
                  <p className="text-2xl font-bold">{stats.total_pontos}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <div>
                <p className="text-gray-500 text-sm">Praias</p>
                <p className="text-2xl font-bold">{stats.total_praias}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <div>
                <p className="text-gray-500 text-sm">Total de Reviews</p>
                <p className="text-2xl font-bold">{stats.total_reviews}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <div>
                <p className="text-gray-500 text-sm">Rating Médio</p>
                <p className="text-2xl font-bold">{stats.avg_rating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Pontos */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagens</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pontos.map((ponto) => (
                <tr key={ponto._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{ponto.nome}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{ponto.descricao}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-ocean/10 text-ocean rounded-full text-xs">
                      {ponto.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {ponto.imagens.slice(0, 3).map((img, idx) => (
                        <img
                          key={idx}
                          src={img.url}
                          alt=""
                          className="w-12 h-12 object-cover rounded"
                        />
                      ))}
                      {ponto.imagens.length > 3 && (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                          +{ponto.imagens.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEditModal(ponto)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(ponto._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">
                {editingPonto ? 'Editar Ponto' : 'Novo Ponto'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  required
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="praia">Praia</option>
                    <option value="restaurante">Restaurante</option>
                    <option value="hotel">Hotel</option>
                    <option value="pousada">Pousada</option>
                    <option value="atracao">Atração</option>
                    <option value="mergulho">Mergulho</option>
                    <option value="cultura">Cultura</option>
                    <option value="natureza">Natureza</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Preço Médio (MT)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.preco_medio}
                    onChange={(e) => setFormData({ ...formData, preco_medio: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="-23.8650"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="35.3833"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Horário de Funcionamento</label>
                <input
                  type="text"
                  value={formData.horario_funcionamento}
                  onChange={(e) => setFormData({ ...formData, horario_funcionamento: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="09:00 - 18:00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Contato</label>
                <input
                  type="text"
                  value={formData.contato}
                  onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="+258 XX XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <ImageIcon className="inline mr-2" size={18} />
                  Imagens
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Selecione uma ou mais imagens (serão enviadas para o Cloudinary)
                </p>
              </div>

              {editingPonto && editingPonto.imagens.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Imagens Atuais</label>
                  <div className="grid grid-cols-3 gap-2">
                    {editingPonto.imagens.map((img) => (
                      <div key={img.public_id} className="relative group">
                        <img src={img.url} alt="" className="w-full h-32 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(editingPonto._id, img.public_id)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-ocean text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {submitting ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
