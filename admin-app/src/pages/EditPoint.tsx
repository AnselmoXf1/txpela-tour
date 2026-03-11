import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Save } from 'lucide-react';
import { pontosService } from '../services/api';
import type { PontoTuristico } from '../types';

const CATEGORIAS = [
  { value: 'praia', label: 'Praia' },
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'pousada', label: 'Pousada' },
  { value: 'atracao', label: 'Atração' },
  { value: 'mergulho', label: 'Mergulho' },
  { value: 'cultura', label: 'Cultura' },
  { value: 'natureza', label: 'Natureza' },
];

export default function EditPoint() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ponto, setPonto] = useState<PontoTuristico | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: 'praia',
    latitude: '',
    longitude: '',
    preco_medio: '',
    horario_funcionamento: '',
    contato: '',
  });

  useEffect(() => {
    if (id) {
      loadPonto();
    }
  }, [id]);

  const loadPonto = async () => {
    try {
      const response = await pontosService.getById(id!);
      const pontoData = response.data;
      setPonto(pontoData);
      
      setFormData({
        nome: pontoData.nome,
        descricao: pontoData.descricao,
        categoria: pontoData.categoria,
        latitude: pontoData.localizacao.coordinates[1].toString(),
        longitude: pontoData.localizacao.coordinates[0].toString(),
        preco_medio: pontoData.preco_medio?.toString() || '',
        horario_funcionamento: pontoData.horario_funcionamento || '',
        contato: pontoData.contato || '',
      });
    } catch (err) {
      console.error('Erro ao carregar ponto:', err);
      alert('Erro ao carregar ponto turístico');
      navigate('/points');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.descricao || !formData.latitude || !formData.longitude) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        nome: formData.nome,
        descricao: formData.descricao,
        categoria: formData.categoria,
        localizacao: {
          type: 'Point' as const,
          coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
        },
        preco_medio: formData.preco_medio ? parseFloat(formData.preco_medio) : undefined,
        horario_funcionamento: formData.horario_funcionamento,
        contato: formData.contato,
      };

      await pontosService.update(id!, updateData);
      alert('Ponto turístico atualizado com sucesso!');
      navigate('/points');
    } catch (err) {
      console.error('Erro ao atualizar ponto:', err);
      alert('Erro ao atualizar ponto turístico');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-ocean border-t-transparent"></div>
      </div>
    );
  }

  if (!ponto) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Ponto turístico não encontrado</p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/points')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Editar Ponto Turístico</h1>
        <p className="text-gray-600">Atualize os dados do ponto turístico</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Informações Básicas */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informações Básicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-transparent"
              >
                {CATEGORIAS.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço Médio (R$)
              </label>
              <input
                type="number"
                name="preco_medio"
                value={formData.preco_medio}
                onChange={handleInputChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Localização */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={20} />
            Localização
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude *
              </label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                step="any"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude *
              </label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                step="any"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contato e Horário</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário de Funcionamento
              </label>
              <input
                type="text"
                name="horario_funcionamento"
                value={formData.horario_funcionamento}
                onChange={handleInputChange}
                placeholder="Seg-Dom: 8h-18h"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contato
              </label>
              <input
                type="text"
                name="contato"
                value={formData.contato}
                onChange={handleInputChange}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Nota sobre imagens */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Para editar as imagens deste ponto, use o botão de edição de fotos na lista de pontos turísticos.
          </p>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/points')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-ocean text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={20} />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
