import { useState } from 'react';
import { X, Upload, Trash2, Image as ImageIcon, GripVertical, Star } from 'lucide-react';
import { pontosService } from '../services/api';
import type { PontoTuristico } from '../types';

interface EditImagesModalProps {
  ponto: PontoTuristico;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditImagesModal({ ponto, onClose, onUpdate }: EditImagesModalProps) {
  const [images, setImages] = useState(ponto.imagens || []);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('alt', ponto.nome);

        const response = await pontosService.uploadImage(ponto._id, formData);
        setImages(prev => [...prev, response.data]);
      }
      alert('Imagens enviadas com sucesso!');
      onUpdate();
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      alert('Erro ao enviar imagens');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (publicId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta imagem?')) return;

    try {
      await pontosService.deleteImage(ponto._id, publicId);
      setImages(prev => prev.filter(img => img.public_id !== publicId));
      alert('Imagem deletada com sucesso!');
      onUpdate();
    } catch (err) {
      console.error('Erro ao deletar:', err);
      alert('Erro ao deletar imagem');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // Reordenação de imagens
  const handleImageDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleImageDragEnd = async () => {
    if (draggedIndex !== null) {
      // Salvar nova ordem no backend
      await saveImageOrder();
    }
    setDraggedIndex(null);
  };

  const saveImageOrder = async () => {
    setSaving(true);
    try {
      await pontosService.update(ponto._id, { imagens: images });
      onUpdate();
    } catch (err) {
      console.error('Erro ao salvar ordem:', err);
      alert('Erro ao salvar ordem das imagens');
    } finally {
      setSaving(false);
    }
  };

  const setAsMainImage = async (index: number) => {
    const newImages = [...images];
    const mainImage = newImages.splice(index, 1)[0];
    newImages.unshift(mainImage);
    setImages(newImages);
    
    // Salvar no backend
    setSaving(true);
    try {
      await pontosService.update(ponto._id, { imagens: newImages });
      alert('Imagem principal atualizada!');
      onUpdate();
    } catch (err) {
      console.error('Erro ao definir imagem principal:', err);
      alert('Erro ao definir imagem principal');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-900">Editar Fotos</h2>
            <p className="text-gray-600 mt-1">{ponto.nome}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 mb-6 transition ${
              dragOver
                ? 'border-ocean bg-ocean/5'
                : 'border-gray-300 hover:border-ocean'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-700 font-medium mb-2">
                Arraste imagens aqui ou clique para selecionar
              </p>
              <p className="text-sm text-gray-500 mb-4">
                PNG, JPG ou WEBP até 10MB
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  disabled={uploading}
                />
                <span className="bg-ocean text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition cursor-pointer inline-block">
                  {uploading ? 'Enviando...' : 'Selecionar Arquivos'}
                </span>
              </label>
            </div>
          </div>

          {/* Images Grid */}
          {images.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Arraste as imagens para reordenar. A primeira imagem é a principal.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div
                    key={image.public_id}
                    draggable
                    onDragStart={() => handleImageDragStart(index)}
                    onDragOver={(e) => handleImageDragOver(e, index)}
                    onDragEnd={handleImageDragEnd}
                    className={`relative group rounded-lg overflow-hidden border-2 transition cursor-move ${
                      draggedIndex === index
                        ? 'border-ocean scale-105 shadow-lg'
                        : 'border-gray-200 hover:border-ocean'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* Drag Handle */}
                    <div className="absolute top-2 right-2 bg-white/90 p-1 rounded opacity-0 group-hover:opacity-100 transition">
                      <GripVertical size={20} className="text-gray-600" />
                    </div>

                    {/* Overlay com ações */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      {index !== 0 && (
                        <button
                          onClick={() => setAsMainImage(index)}
                          className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition"
                          title="Definir como principal"
                        >
                          <Star size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteImage(image.public_id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                        title="Deletar imagem"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {/* Badge de imagem principal */}
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-ocean text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <Star size={12} fill="white" />
                        Principal
                      </div>
                    )}

                    {/* Número da ordem */}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p>Nenhuma imagem cadastrada</p>
              <p className="text-sm mt-2">Faça upload da primeira imagem acima</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {images.length} {images.length === 1 ? 'imagem' : 'imagens'}
            {saving && <span className="ml-2 text-ocean">Salvando...</span>}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
