import React, { useEffect, useState } from 'react';
import { postsService, Post } from '../services/api';
import { Megaphone, Calendar, Newspaper } from 'lucide-react';

export default function PostsCarousel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data } = await postsService.getAll();
      setPosts(data);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'promotion':
        return <Megaphone size={20} className="text-green-600" />;
      case 'event':
        return <Calendar size={20} className="text-blue-600" />;
      case 'news':
        return <Newspaper size={20} className="text-purple-600" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'promotion':
        return 'Promoção';
      case 'event':
        return 'Evento';
      case 'news':
        return 'Notícia';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[300px] h-40 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Novidades</h2>
      
      {/* Scrollbar oculta mas funcional */}
      <div 
        className="flex gap-4 overflow-x-auto pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <style>{`
          .flex::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {posts.map((post) => (
          <div
            key={post.id}
            className="min-w-[300px] bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-3">
              {getIcon(post.type)}
              <span className="text-sm font-medium text-gray-600">
                {getTypeLabel(post.type)}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
              {post.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {post.content}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{post.business_name}</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
