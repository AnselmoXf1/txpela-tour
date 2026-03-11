import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, MapPin } from 'lucide-react';
import { pontosService } from '../services/api';

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

export default function CreatePoint() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
    
    // Criar previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.descricao || !formData.latitude || !formData.longitude) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (images.length === 0) {
      alert('Adicione pelo menos uma imagem');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('nome', formData.nome);
      data.append('descricao', formData.descricao);
      data.append('categoria', formData.categoria);
      data.append('latitude', formData.latitude);
      data.append('longitude', formData.longitude);
      data.append('preco_medio', formData.preco_medio || '0');
      data.append('horario_funcionamento', formData.horario_funcionamento);
      data.append('contato', formData.contato);
      
      images.forEach(image => {
        data.append('imagens', image);
      });

      await pontosService.create(data);
      alert('Ponto turístico criado com sucesso!');
      navigate('/points');
    } catch (err) {
      console.error('Erro ao criar ponto:', err);
      alert('Erro ao criar ponto turístico');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Novo Ponto Turístico</h1>
        <p className="text-gray-600">Preencha os dados do novo ponto turístico</p>
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
                placeholder="-2.5297"
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
                placeholder="32.3833"
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

        {/* Imagens */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Imagens *</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-ocean transition">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-700 font-medium mb-2">
              Clique para selecionar imagens
            </p>
            <p className="text-sm text-gray-500 mb-4">
              PNG, JPG ou WEBP até 10MB cada
            </p>
            <label className="inline-block">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <span className="bg-ocean text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition cursor-pointer inline-block">
                Selecionar Imagens
              </span>
            </label>
          </div>

          {/* Preview das imagens */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={16} />
                  </button>
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-ocean text-white px-2 py-1 rounded text-xs font-bold">
                      Principal
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
            disabled={loading}
            className="bg-ocean text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Ponto Turístico'}
          </button>
        </div>
      </form>
    </div>
  );
}
