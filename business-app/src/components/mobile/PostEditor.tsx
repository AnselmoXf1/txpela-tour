import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Upload, Calendar, Tag, Eye, EyeOff } from 'lucide-react';

interface PostEditorProps {
  onClose: () => void;
  onSave: (post: any) => void;
  editingPost?: any;
}

export default function PostEditor({ onClose, onSave, editingPost }: PostEditorProps) {
  const [formData, setFormData] = useState({
    title: editingPost?.title || '',
    content: editingPost?.content || '',
    type: editingPost?.type || 'promotion',
    active: editingPost?.active ?? true,
    featured: editingPost?.featured || false,
    expires_at: editingPost?.expires_at || '',
  });
  
  const [images, setImages] = useState<string[]>(editingPost?.images || []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const postTypes = [
    { value: 'promotion', label: 'Promoção', icon: '🎯', color: 'bg-green-100 text-green-700' },
    { value: 'event', label: 'Evento', icon: '🎉', color: 'bg-blue-100 text-blue-700' },
    { value: 'news', label: 'Notícia', icon: '📰', color: 'bg-purple-100 text-purple-700' },
    { value: 'menu', label: 'Cardápio', icon: '🍽️', color: 'bg-orange-100 text-orange-700' },
    { value: 'service', label: 'Serviço', icon: '🔧', color: 'bg-gray-100 text-gray-700' },
    { value: 'announcement', label: 'Anúncio', icon: '📢', color: 'bg-red-100 text-red-700' },
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    
    // Simular upload (substituir por upload real para Cloudinary/S3)
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === files.length) {
          setImages([...images, ...newImages]);
          setUploading(false);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      images,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {editingPost ? 'Editar Post' : 'Novo Post'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Tipo de Post */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Post
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {postTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition ${
                      formData.type === type.value
                        ? `${type.color} border-current`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mb-2">{type.icon}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Promoção de Verão 50% OFF"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Conteúdo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conteúdo
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                placeholder="Descreva seu post..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Upload de Imagens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagens
              </label>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition flex flex-col items-center justify-center gap-2"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                ) : (
                  <>
                    <Upload size={32} className="text-gray-400" />
                    <p className="text-gray-600">Clique para adicionar imagens</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF até 5MB</p>
                  </>
                )}
              </button>

              {/* Preview de Imagens */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Opções */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Data de Expiração (opcional)
                </label>
                <input
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700 flex items-center gap-2">
                    {formData.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    Post Ativo
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700 flex items-center gap-2">
                    <Tag size={16} />
                    Destacar Post
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                {editingPost ? 'Salvar' : 'Publicar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}