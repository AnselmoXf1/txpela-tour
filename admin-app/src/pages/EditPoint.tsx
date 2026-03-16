import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function EditPoint() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button
        onClick={() => navigate('/points')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">
          Editar Ponto Turístico
        </h1>
        <p className="text-gray-600 mb-6">
          Funcionalidade de edição em desenvolvimento.
        </p>
        <p className="text-sm text-gray-500">
          Por enquanto, use o Django Admin para editar pontos turísticos.
        </p>
      </div>
    </div>
  );
}
