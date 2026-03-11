import { MapPin, Star, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import type { PontoTuristico } from '../types';

interface PointPreviewProps {
  point: PontoTuristico;
  viewMode: 'feed' | 'explore';
}

export default function PointPreview({ point, viewMode }: PointPreviewProps) {
  const calculateAverageRating = () => {
    if (!point.reviews || point.reviews.length === 0) return 0;
    const sum = point.reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / point.reviews.length;
  };

  const avgRating = calculateAverageRating();
  const imageUrl = point.imagens[0]?.url || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800';
  const reviewCount = point.reviews?.length || 0;

  if (viewMode === 'feed') {
    return (
      <article className="bg-white border rounded-xl shadow-sm max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <MapPin size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">{point.nome}</h3>
              <p className="text-xs text-gray-500">{point.categoria}</p>
            </div>
          </div>
          <button className="text-gray-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5"/>
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-square">
          <img
            src={imageUrl}
            alt={point.nome}
            className="w-full h-full object-cover"
          />
          {avgRating > 0 && (
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-white text-sm font-bold">{avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Heart size={24} />
              <MessageCircle size={24} />
              <Share2 size={24} />
            </div>
            <Bookmark size={24} />
          </div>

          {reviewCount > 0 && (
            <p className="font-bold text-sm text-gray-900 mb-2">
              {reviewCount} {reviewCount === 1 ? 'avaliação' : 'avaliações'}
            </p>
          )}

          <div className="mb-2">
            <p className="text-sm">
              <span className="font-bold text-gray-900">{point.nome}</span>{' '}
              <span className="text-gray-700 line-clamp-2">{point.descricao}</span>
            </p>
          </div>

          {reviewCount > 0 && (
            <p className="text-sm text-gray-500">
              Ver todas as {reviewCount} avaliações
            </p>
          )}

          <p className="text-xs text-gray-400 mt-2">HÁ 2 HORAS</p>
        </div>
      </article>
    );
  }

  // Explore mode
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 max-w-sm">
      <div className="h-32 overflow-hidden">
        <img
          src={imageUrl}
          alt={point.nome}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-900">{point.nome}</h3>
          {avgRating > 0 && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold flex items-center gap-1">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              {avgRating.toFixed(1)}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{point.descricao}</p>
        <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
          <MapPin size={12} />
          {point.categoria}
        </div>
      </div>
    </div>
  );
}
