import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Star, MapPin, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface Review {
  ponto_nome: string;
  ponto_id: string;
  rating: number;
  comentario: string;
  data: string;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setFormData({
      name: user.name || '',
      email: user.email || ''
    });
    
    loadUserReviews();
  }, [user, navigate]);

  const loadUserReviews = async () => {
    try {
      // Buscar todas as reviews do usuário
      const response = await api.get('/pontos-turisticos/');
      const pontos = response.data;
      
      const userReviews: Review[] = [];
      pontos.forEach((ponto: any) => {
        if (ponto.reviews) {
          ponto.reviews.forEach((review: any) => {
            if (review.usuario === user?.username || review.usuario === user?.name) {
              userReviews.push({
                ponto_nome: ponto.nome,
                ponto_id: ponto._id,
                rating: review.rating,
                comentario: review.comentario,
                data: review.data
              });
            }
          });
        }
      });
      
      setReviews(userReviews);
    } catch (err) {
      console.error('Erro ao carregar reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Aqui você pode adicionar uma API para atualizar o perfil
      // Por enquanto, apenas fecha o modo de edição
      setEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      alert('Erro ao atualizar perfil');
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header do Perfil */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-ocean to-tropical h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end gap-4">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <User size={64} className="text-ocean" />
                </div>
                <div className="mb-4">
                  <h1 className="text-3xl font-heading font-bold text-gray-900">
                    {user?.name}
                  </h1>
                  {user?.is_staff && (
                    <span className="inline-block bg-sun text-white px-3 py-1 rounded-full text-sm font-bold mt-2">
                      Administrador
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="mb-4 bg-ocean text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
              >
                {editing ? (
                  <>
                    <X size={18} />
                    Cancelar
                  </>
                ) : (
                  <>
                    <Edit2 size={18} />
                    Editar Perfil
                  </>
                )}
              </button>
            </div>

            {/* Informações do Perfil */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <User className="text-ocean" size={20} />
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  ) : (
                    <span>{user?.name}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="text-ocean" size={20} />
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  ) : (
                    <span>{user?.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="text-ocean" size={20} />
                  <span>Membro desde {new Date().getFullYear()}</span>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-ocean/10 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-ocean">{reviews.length}</div>
                  <div className="text-sm text-gray-600">Avaliações</div>
                </div>
                <div className="bg-sun/10 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-sun flex items-center justify-center gap-1">
                    <Star size={24} className="fill-sun" />
                    {calculateAverageRating()}
                  </div>
                  <div className="text-sm text-gray-600">Média</div>
                </div>
              </div>
            </div>

            {editing && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-ocean text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <Save size={18} />
                  Salvar Alterações
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Minhas Avaliações */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
            <Star className="text-sun fill-sun" />
            Minhas Avaliações
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">Você ainda não fez nenhuma avaliação</p>
              <p className="text-sm">Explore os pontos turísticos e deixe sua opinião!</p>
              <button
                onClick={() => navigate('/explore')}
                className="mt-4 bg-ocean text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Explorar Agora
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/point/${review.ponto_id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-ocean">{review.ponto_nome}</h3>
                    <div className="flex items-center gap-1 text-sun">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'fill-sun' : ''}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{review.comentario}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.data).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={logout}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
}
