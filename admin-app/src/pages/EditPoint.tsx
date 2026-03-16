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
      const lng = parseFloat(formData.longitude);
      const lat = parseFloat(formData.latitude);
      
      const updateData = {
        nome: formData.nome,
        descricao: formData.descricao,
        categoria: formData.categoria,
        lo
          type: 'Point' as const,
          coordinates: [lng, lat] as [number, number]
        },
        ndefined,
,
        contato: formData.contato,
      };

      await pontosS;
      alert('Ponto turístico atualizado com sucesso!');
      navigate('/points');
    } catch (er
      console.error('Errr);
     o');
    
);
    }
  };

  if (loading) {
    return (
      ">
   ></div>

    );
  }

  if (!ponto) {
    return (
      ">
   do</p>
>
    );
  }

  return (
    <div>
      <utton
        onClick={() => navigate
        classN
      >
={20} />
        Voltar
      </button>

      <div c
o</h1>
        <p className="text-gray-600">Atualize os dados do ponto turístico</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border bor">
        <d8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Inh2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class">
              <label cb-2">
                Nome *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange
                ent"
                red

            </div>

            <div className=>
              <label c2">
                Descriço *
              </label>
              <textarea
                name="descricao"
                value={fo}
                onChange={handleInputChange}
                rows={4}
                
                rered
 />
            </div>

            <div>
              <label cb-2">
                Categ*
              </label>
              <select
                name="categoria"
                value={formData.categoria}
               
                className="w-full px-4 p"
              >
                {CA (
                  <optiption>
                ))}
elect>
            </div

            <div>
              <label c">
                Preç$)
              </label>
              <input
                type="number"
                name="preco_medio"
                value={formedio}
                onChange={handleInputChange}
                .01"
                cl
              />
            </

        </div>

        <div className="mb-8">
          <h2 className="text-xl-2">
            <MapPin siz/>
            Locação
          >
          
          <div clp-6">
            <div>
              <label class
                Latitude *
              </label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={e}
                step="any"
                classNamt"
                uired
              />
div>

            <div>
              <label classN">
                Longit
              </label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={ge}
                step="any"
                classNamparent"
                d
              />
            </div>
          </div>
  </div>

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

        <div className="mb-8 p-4 b">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Para editar os.
          </p>
        </div>

">
          <button
            type="button"
            onClints')}
            className="pxmedium"
          >
            Cancelar
          <button>
          <button
            type="sit"
            disab}
            className="bgp-2"
          >
            <Save size={20} />
           }
          </button>
        </div>
      </form>
    </div>
  );
}
