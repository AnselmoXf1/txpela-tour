from django.contrib import admin
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from bson import ObjectId
import cloudinary.uploader
from .mongodb import mongodb
from django.conf import settings

# Configurar Cloudinary
import cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)


class PontoTuristicoAdmin:
    """
    Admin customizado para gerenciar Pontos Turísticos no MongoDB
    """
    
    def __init__(self):
        self._collection = None
    
    @property
    def collection(self):
        """Lazy loading da collection"""
        if self._collection is None:
            self._collection = mongodb.get_collection('pontos_turisticos')
        return self._collection
    
    def get_urls(self):
        """URLs customizadas para o admin"""
        from django.urls import path
        return [
            path('', self.list_view, name='pontos_list'),
            path('add/', self.add_view, name='pontos_add'),
            path('<str:ponto_id>/change/', self.change_view, name='pontos_change'),
            path('<str:ponto_id>/delete/', self.delete_view, name='pontos_delete'),
            path('<str:ponto_id>/delete-image/<str:public_id>/', self.delete_image_view, name='pontos_delete_image'),
        ]
    
    def list_view(self, request):
        """Lista todos os pontos turísticos"""
        pontos = list(self.collection.find())
        
        # Adicionar estatísticas
        stats = {
            'total': len(pontos),
            'praias': len([p for p in pontos if p.get('categoria') == 'praia']),
            'restaurantes': len([p for p in pontos if p.get('categoria') == 'restaurante']),
            'hoteis': len([p for p in pontos if p.get('categoria') == 'hotel']),
        }
        
        context = {
            'pontos': pontos,
            'stats': stats,
            'title': 'Pontos Turísticos',
        }
        return render(request, 'admin/pontos_turisticos/list.html', context)
    
    def add_view(self, request):
        """Adiciona novo ponto turístico"""
        if request.method == 'POST':
            try:
                # Upload de imagens para Cloudinary
                imagens = []
                files = request.FILES.getlist('imagens')
                
                for file in files:
                    upload_result = cloudinary.uploader.upload(
                        file,
                        folder="txopela_tour",
                        resource_type="image"
                    )
                    imagens.append({
                        "url": upload_result['secure_url'],
                        "public_id": upload_result['public_id'],
                        "alt": request.POST.get('nome', 'Imagem')
                    })
                
                # Criar documento
                ponto_data = {
                    "nome": request.POST.get('nome'),
                    "descricao": request.POST.get('descricao'),
                    "categoria": request.POST.get('categoria'),
                    "localizacao": {
                        "type": "Point",
                        "coordinates": [
                            float(request.POST.get('longitude')),
                            float(request.POST.get('latitude'))
                        ]
                    },
                    "imagens": imagens,
                    "reviews": [],
                    "preco_medio": float(request.POST.get('preco_medio', 0)),
                    "horario_funcionamento": request.POST.get('horario_funcionamento', ''),
                    "contato": request.POST.get('contato', '')
                }
                
                self.collection.insert_one(ponto_data)
                messages.success(request, 'Ponto turístico criado com sucesso!')
                return redirect('admin:pontos_list')
                
            except Exception as e:
                messages.error(request, f'Erro ao criar ponto: {str(e)}')
        
        context = {
            'title': 'Adicionar Ponto Turístico',
            'categorias': ['praia', 'restaurante', 'hotel', 'pousada', 'atracao', 'mergulho', 'cultura', 'natureza'],
        }
        return render(request, 'admin/pontos_turisticos/form.html', context)
    
    def change_view(self, request, ponto_id):
        """Edita ponto turístico existente"""
        ponto = self.collection.find_one({'_id': ObjectId(ponto_id)})
        
        if not ponto:
            messages.error(request, 'Ponto turístico não encontrado!')
            return redirect('admin:pontos_list')
        
        if request.method == 'POST':
            try:
                # Upload de novas imagens
                imagens = ponto.get('imagens', [])
                files = request.FILES.getlist('imagens')
                
                for file in files:
                    upload_result = cloudinary.uploader.upload(
                        file,
                        folder="txopela_tour",
                        resource_type="image"
                    )
                    imagens.append({
                        "url": upload_result['secure_url'],
                        "public_id": upload_result['public_id'],
                        "alt": request.POST.get('nome', 'Imagem')
                    })
                
                # Atualizar documento
                update_data = {
                    "nome": request.POST.get('nome'),
                    "descricao": request.POST.get('descricao'),
                    "categoria": request.POST.get('categoria'),
                    "localizacao": {
                        "type": "Point",
                        "coordinates": [
                            float(request.POST.get('longitude')),
                            float(request.POST.get('latitude'))
                        ]
                    },
                    "imagens": imagens,
                    "preco_medio": float(request.POST.get('preco_medio', 0)),
                    "horario_funcionamento": request.POST.get('horario_funcionamento', ''),
                    "contato": request.POST.get('contato', '')
                }
                
                self.collection.update_one(
                    {'_id': ObjectId(ponto_id)},
                    {'$set': update_data}
                )
                
                messages.success(request, 'Ponto turístico atualizado com sucesso!')
                return redirect('admin:pontos_list')
                
            except Exception as e:
                messages.error(request, f'Erro ao atualizar ponto: {str(e)}')
        
        context = {
            'title': 'Editar Ponto Turístico',
            'ponto': ponto,
            'categorias': ['praia', 'restaurante', 'hotel', 'pousada', 'atracao', 'mergulho', 'cultura', 'natureza'],
        }
        return render(request, 'admin/pontos_turisticos/form.html', context)
    
    def delete_view(self, request, ponto_id):
        """Deleta ponto turístico"""
        if request.method == 'POST':
            try:
                ponto = self.collection.find_one({'_id': ObjectId(ponto_id)})
                
                if ponto:
                    # Deletar imagens do Cloudinary
                    for imagem in ponto.get('imagens', []):
                        try:
                            cloudinary.uploader.destroy(imagem['public_id'])
                        except:
                            pass
                    
                    # Deletar do banco
                    self.collection.delete_one({'_id': ObjectId(ponto_id)})
                    messages.success(request, 'Ponto turístico deletado com sucesso!')
                else:
                    messages.error(request, 'Ponto turístico não encontrado!')
                    
            except Exception as e:
                messages.error(request, f'Erro ao deletar ponto: {str(e)}')
        
        return redirect('admin:pontos_list')
    
    def delete_image_view(self, request, ponto_id, public_id):
        """Deleta uma imagem específica"""
        if request.method == 'POST':
            try:
                # Deletar do Cloudinary
                cloudinary.uploader.destroy(public_id)
                
                # Remover do banco
                self.collection.update_one(
                    {'_id': ObjectId(ponto_id)},
                    {'$pull': {'imagens': {'public_id': public_id}}}
                )
                
                return JsonResponse({'success': True})
            except Exception as e:
                return JsonResponse({'success': False, 'error': str(e)})
        
        return JsonResponse({'success': False, 'error': 'Método não permitido'})


# Registrar no admin
ponto_admin = PontoTuristicoAdmin()
