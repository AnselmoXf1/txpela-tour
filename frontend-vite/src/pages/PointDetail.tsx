import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Send, MoreHorizontal, Clock, DollarSign, Phone } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'motion/react';
import L from 'leaflet';
import { pontosTuristicosService, PontoTuristico } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Fix Leaflet default icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function PointDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [point, setPoint] = useState<PontoTuristico | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      loadPoint(id);
    }
  }, [id]);

  const loadPoint = async (pointId: string) => {
    try {
      setLoading(true);
      const response = await pontosTuristicosService.getById(pointId);
      console.log('Point loaded:', response.data);
      setPoint(response.data);
    } catch (err) {
      console.error('Error loading point:', err);
      setPoint(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;
    
    setSubmitting(true);
    try {
      await pontosTuristicosService.addReview(id, rating, comentario);
      setReviewSuccess(true);
      setRating(0);
      setComentario('');
      await loadPoint(id);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
      alert('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateAverageRating = (p: PontoTuristico) => {
    if (!p.reviews || p.reviews.length === 0) return 0;
    const sum = p.reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / p.reviews.length;
  };

  const getLatLng = (p: PontoTuristico): [number, number] | null => {
    if (p.localizacao && p.localizacao.coordinates && p.localizacao.coordinates.length === 2) {
      const [lng, lat] = p.localizacao.coordinates;
      return [lat, lng];
    }
    return null;
  };

  const handleShare = async () => {
    if (!point) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: point.nome,
          text: point.descricao,
          url: window.location.href
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-ocean border-t-transparent mx-auto mb-4"></div>
          <div className="text-white text-xl">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!point) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-4">
        <MapPin size={64} className="text-gray-700 mb-4" />
        <h2 className="text-2xl font-bold">Ponto turístico não encontrado</h2>
        <p className="text-gray-400 text-center">Este local pode ter sido removido ou o link está incorreto.</p>
        <button
          onClick={() => navigate('/explore')}
          className="mt-4 bg-ocean text-white px-6 py-3 rounded-xl font-bold hover:bg-ocean/90 transition"
        >
          Voltar para Explorar
        </button>
      </div>
    );
  }

  const avgRating = calculateAverageRating(point);
  const coordinates = getLatLng(point);
  const [lat, lng] = coordinates || [-23.8650, 35.3833];
  const hasValidCoordinates = coordinates !== null;
  const images = point.imagens || [];

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      {/* Header fixo */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-800 rounded-full transition">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ocean rounded-full flex items-center justify-center">
              <MapPin size={16} />
            </div>
            <span className="font-bold truncate max-w-[200px]">{point.nome}</span>
          </div>
          <button className="p-2 hover:bg-gray-800 rounded-full transition">
            <MoreHorizontal size={24} />
          </button>
        </div>
      </div>

      {/* Galeria de Imagens */}
      <div className="relative h-screen max-h-[600px] mt-14">
        {images.length > 0 ? (
          <>
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={images[currentImageIndex]?.url}
              alt={point.nome}
              className="w-full h-full object-cover"
            />
            
            {images.length > 1 && (
              <div className="absolute top-4 left-0 right-0 flex gap-1 px-4">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-0.5 flex-1 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition"
                >
                  →
                </button>
              </>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-ocean px-3 py-1 rounded-full text-xs font-bold">
                  {point.categoria}
                </span>
                {avgRating > 0 && (
                  <span className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star size={12} className="fill-sun text-sun" />
                    {avgRating.toFixed(1)}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{point.nome}</h1>
              <p className="text-gray-300 text-sm line-clamp-2">{point.descricao}</p>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <MapPin size={64} className="text-gray-700" />
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={() => setLiked(!liked)} className="transition-transform active:scale-90">
              <Heart size={28} className={liked ? 'fill-red-500 text-red-500' : ''} />
            </button>
            <button className="transition-transform active:scale-90">
              <MessageCircle size={28} />
            </button>
            <button onClick={handleShare} className="transition-transform active:scale-90">
              <Share2 size={28} />
            </button>
          </div>
          <button onClick={() => setSaved(!saved)} className="transition-transform active:scale-90">
            <Bookmark size={28} className={saved ? 'fill-white' : ''} />
          </button>
        </div>
        <div className="text-sm text-gray-400">
          {point.reviews?.length || 0} avaliações
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-3">
          {point.horario_funcionamento && (
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <Clock size={20} className="mx-auto mb-2 text-ocean" />
              <div className="text-xs text-gray-400 mb-1">Horário</div>
              <div className="text-sm font-bold">{point.horario_funcionamento}</div>
            </div>
          )}
          {point.preco_medio && point.preco_medio > 0 && (
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <DollarSign size={20} className="mx-auto mb-2 text-sun" />
              <div className="text-xs text-gray-400 mb-1">Preço</div>
              <div className="text-sm font-bold">{point.preco_medio} MT</div>
            </div>
          )}
          {point.contato && (
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <Phone size={20} className="mx-auto mb-2 text-tropical" />
              <div className="text-xs text-gray-400 mb-1">Contato</div>
              <div className="text-xs font-bold truncate">{point.contato}</div>
            </div>
          )}
        </div>

        {/* Descrição */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-3">Sobre</h2>
          <p className="text-gray-300 leading-relaxed">{point.descricao}</p>
        </div>

        {/* Mapa */}
        {hasValidCoordinates && (
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MapPin size={20} className="text-ocean" />
                Localização
              </h2>
            </div>
            <MapContainer
              center={[lat, lng]}
              zoom={15}
              style={{ height: '300px', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; CartoDB'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
                maxZoom={20}
              />
              <Marker position={[lat, lng]}>
                <Popup>{point.nome}</Popup>
              </Marker>
            </MapContainer>
            <div className="p-4">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-ocean text-white py-3 rounded-lg hover:bg-ocean/90 transition text-center font-bold"
              >
                Abrir no Google Maps
              </a>
            </div>
          </div>
        )}

        {/* Avaliação */}
        {user ? (
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Deixe sua Avaliação</h2>
            {reviewSuccess && (
              <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded-lg text-sm">
                ✓ Avaliação enviada!
              </div>
            )}
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={star <= rating ? 'text-sun fill-sun' : 'text-gray-600'}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean text-white placeholder-gray-500"
                rows={3}
                placeholder="Compartilhe sua experiência..."
              />
              <button
                type="submit"
                disabled={rating === 0 || submitting}
                className="w-full bg-ocean text-white py-3 rounded-xl font-bold hover:bg-ocean/90 transition disabled:bg-gray-700 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {submitting ? 'Enviando...' : 'Publicar'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl p-6 text-center">
            <p className="text-gray-400 mb-4">Faça login para avaliar</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-ocean text-white px-6 py-3 rounded-xl font-bold hover:bg-ocean/90 transition"
            >
              Fazer Login
            </button>
          </div>
        )}

        {/* Reviews */}
        {point.reviews && point.reviews.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageCircle size={20} />
              Avaliações ({point.reviews.length})
            </h2>
            <div className="space-y-4">
              {point.reviews.map((review, idx) => (
                <div key={idx} className="border-b border-gray-800 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-ocean rounded-full flex items-center justify-center text-sm font-bold">
                        {review.usuario[0].toUpperCase()}
                      </div>
                      <span className="font-bold">{review.usuario}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? 'fill-sun text-sun' : 'text-gray-600'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{review.comentario}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(review.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
