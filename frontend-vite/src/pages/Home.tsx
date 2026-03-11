import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { pontosTuristicosService, PontoTuristico, calculateAverageRating } from '../services/api';
import PostsCarousel from '../components/PostsCarousel';

export default function Home() {
  const [points, setPoints] = useState<PontoTuristico[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    loadPoints();
    const savedLikes = localStorage.getItem('likedPosts');
    const savedSaves = localStorage.getItem('savedPosts');
    if (savedLikes) setLikedPosts(new Set(JSON.parse(savedLikes)));
    if (savedSaves) setSavedPosts(new Set(JSON.parse(savedSaves)));
  }, []);

  const loadPoints = async () => {
    try {
      const response = await pontosTuristicosService.getAll();
      setPoints(response.data);
    } catch (err) {
      console.error('Failed to fetch points:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (pointId: string) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(pointId)) {
      newLiked.delete(pointId);
    } else {
      newLiked.add(pointId);
    }
    setLikedPosts(newLiked);
    localStorage.setItem('likedPosts', JSON.stringify([...newLiked]));
  };

  const handleSave = (pointId: string) => {
    const newSaved = new Set(savedPosts);
    if (newSaved.has(pointId)) {
      newSaved.delete(pointId);
    } else {
      newSaved.add(pointId);
    }
    setSavedPosts(newSaved);
    localStorage.setItem('savedPosts', JSON.stringify([...newSaved]));
  };

  const handleShare = async (point: PontoTuristico) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: point.nome,
          text: point.descricao,
          url: `${window.location.origin}/point/${point._id}`
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/point/${point._id}`);
      alert('Link copiado!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-ocean border-t-transparent"></div>
      </div>
    );
  }

  const renderStories = () => (
    <div className="bg-white border-b border-gray-200 p-3 md:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide">
          {points.slice(0, 8).map((point) => {
            const imageUrl = point.imagens?.[0]?.url || 'https://images.unsplash.com/photo-1559827260-000000';
            return (
              <button
                key={point._id}
                onClick={() => navigate(`/point/${point._id}`)}
                className="flex flex-col items-center min-w-[70px] md:min-w-[80px]"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-ocean to-tropical p-0.5">
                  <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={point.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-700 truncate mt-2">
                  {point.nome.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderPostCard = (point: PontoTuristico, isMobile: boolean) => {
    const avgRating = calculateAverageRating(point.reviews);
    const imageUrl = point.imagens?.[0]?.url || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19';
    const reviewCount = point.reviews?.length || 0;

    return (
      <motion.article
        key={point._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className={`bg-white ${isMobile ? 'border-b' : 'rounded-xl shadow-sm hover:shadow-md transition-shadow mb-0 lg:mb-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-ocean flex items-center justify-center">
              <MapPin size={16} className="text-white md:w-5 md:h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base text-gray-900">{point.nome}</h3>
              <p className="text-xs text-gray-500">{point.categoria}</p>
            </div>
          </div>
          <button className="text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5"/>
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
        </div>

        {/* Image */}
        <div 
          className="relative w-full aspect-square cursor-pointer"
          onClick={() => navigate(`/point/${point._id}`)}
        >
          <img
            src={imageUrl}
            alt={point.nome}
            className="w-full h-full object-cover"
          />
          {avgRating > 0 && (
            <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-black/70 backdrop-blur-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full flex items-center gap-1">
              <Star size={12} className="fill-sun text-sun md:w-3.5 md:h-3.5" />
              <span className="text-white text-xs md:text-sm font-bold">{avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-3 md:p-4">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(point._id);
                }}
                className={`transition ${likedPosts.has(point._id) ? 'text-red-500' : 'hover:text-red-500'}`}
              >
                <Heart 
                  size={20} 
                  className={`md:w-6 md:h-6 ${likedPosts.has(point._id) ? 'fill-red-500' : ''}`} 
                />
              </button>
              <button 
                onClick={() => navigate(`/point/${point._id}`)}
                className="hover:text-ocean transition"
              >
                <MessageCircle size={20} className="md:w-6 md:h-6" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(point);
                }}
                className="hover:text-ocean transition"
              >
                <Share2 size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleSave(point._id);
              }}
              className={`transition ${savedPosts.has(point._id) ? 'text-ocean' : 'hover:text-ocean'}`}
            >
              <Bookmark 
                size={20} 
                className={`md:w-6 md:h-6 ${savedPosts.has(point._id) ? 'fill-ocean' : ''}`} 
              />
            </button>
          </div>

          {reviewCount > 0 && (
            <p className="font-bold text-xs md:text-sm text-gray-900 mb-1 md:mb-2">
              {reviewCount} {reviewCount === 1 ? 'avaliação' : 'avaliações'}
            </p>
          )}

          <p className="text-xs md:text-sm">
            <span className="font-bold text-gray-900">{point.nome}</span>{' '}
            <span className="text-gray-700 line-clamp-2">{point.descricao}</span>
          </p>

          {reviewCount > 0 && (
            <button 
              onClick={() => navigate(`/point/${point._id}`)}
              className="text-xs md:text-sm text-gray-500 hover:text-gray-700"
            >
              Ver todas as {reviewCount} avaliações
            </button>
          )}

          <p className="text-xs text-gray-400 mt-1 md:mt-2">HÁ 2 HORAS</p>
        </div>
      </motion.article>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Stories */}
      {renderStories()}

      {/* Posts Carousel */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          <PostsCarousel />
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto lg:max-w-2xl xl:max-w-2xl">
        {/* Desktop: Single column with vertical scroll */}
        <div className="hidden lg:block">
          <div className="space-y-6 p-4">
            {points.map((point, index) => renderPostCard(point, false))}
          </div>
        </div>

        {/* Mobile: Grid layout */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 gap-0">
            {points.map((point, index) => renderPostCard(point, true))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {points.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <MapPin size={48} className="text-gray-300 mb-4 md:w-16 md:h-16" />
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Nenhum ponto turístico encontrado</h3>
          <p className="text-sm md:text-base text-gray-500 text-center mb-6">
            Adicione pontos turísticos no painel admin para começar
          </p>
          <Link
            to="/admin"
            className="bg-ocean text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition text-sm md:text-base"
          >
            Ir para Admin
          </Link>
        </div>
      )}
    </div>
  );
}