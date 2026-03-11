from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from bson import ObjectId
from datetime import datetime
from .mongodb import mongodb
from .serializers import PontoTuristicoSerializer

class PontoTuristicoListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """Lista todos os pontos turísticos"""
        collection = mongodb.get_collection('pontos_turisticos')
        pontos = list(collection.find())
        serializer = PontoTuristicoSerializer(pontos, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Cria um novo ponto turístico (apenas admin/curador)"""
        serializer = PontoTuristicoSerializer(data=request.data)
        if serializer.is_valid():
            collection = mongodb.get_collection('pontos_turisticos')
            result = collection.insert_one(serializer.validated_data)
            return Response({'_id': str(result.inserted_id)}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PontoTuristicoDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, ponto_id):
        """Retorna detalhes de um ponto turístico"""
        collection = mongodb.get_collection('pontos_turisticos')
        ponto = collection.find_one({'_id': ObjectId(ponto_id)})
        if not ponto:
            return Response({'error': 'Ponto turístico não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PontoTuristicoSerializer(ponto)
        return Response(serializer.data)

class PontoTuristicoSearchView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Busca pontos turísticos por texto"""
        query = request.query_params.get('q', '').strip()
        collection = mongodb.get_collection('pontos_turisticos')
        
        if not query:
            # Se não houver query, retorna todos
            pontos = list(collection.find())
        else:
            # Tenta busca com índice de texto primeiro
            try:
                pontos = list(collection.find({'$text': {'$search': query}}))
            except Exception as e:
                # Se falhar (sem índice), usa regex como fallback
                print(f"Busca por texto falhou, usando regex: {e}")
                regex_pattern = {'$regex': query, '$options': 'i'}
                pontos = list(collection.find({
                    '$or': [
                        {'nome': regex_pattern},
                        {'descricao': regex_pattern},
                        {'categoria': regex_pattern}
                    ]
                }))
        
        serializer = PontoTuristicoSerializer(pontos, many=True)
        return Response(serializer.data)

class PontoTuristicoNearbyView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Busca pontos turísticos próximos a uma coordenada"""
        lat = float(request.query_params.get('lat'))
        lng = float(request.query_params.get('lng'))
        max_distance = int(request.query_params.get('max_distance', 5000))
        
        collection = mongodb.get_collection('pontos_turisticos')
        pontos = list(collection.find({
            'localizacao': {
                '$near': {
                    '$geometry': {
                        'type': 'Point',
                        'coordinates': [lng, lat]
                    },
                    '$maxDistance': max_distance
                }
            }
        }))
        serializer = PontoTuristicoSerializer(pontos, many=True)
        return Response(serializer.data)

class AddReviewView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, ponto_id):
        """Adiciona uma avaliação a um ponto turístico"""
        rating = request.data.get('rating')
        comentario = request.data.get('comentario', '')
        
        if not rating or not (1 <= int(rating) <= 5):
            return Response({'error': 'Rating deve ser entre 1 e 5'}, status=status.HTTP_400_BAD_REQUEST)
        
        collection = mongodb.get_collection('pontos_turisticos')
        ponto = collection.find_one({'_id': ObjectId(ponto_id)})
        
        if not ponto:
            return Response({'error': 'Ponto turístico não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Criar nova review
        review = {
            'usuario': request.user.username,
            'rating': int(rating),
            'comentario': comentario,
            'data': datetime.now().isoformat()
        }
        
        # Adicionar review ao ponto
        collection.update_one(
            {'_id': ObjectId(ponto_id)},
            {'$push': {'reviews': review}}
        )
        
        return Response({'message': 'Avaliação adicionada com sucesso', 'review': review}, status=status.HTTP_201_CREATED)

class PontoTuristicoStatsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Retorna estatísticas dos pontos turísticos"""
        try:
            collection = mongodb.get_collection('pontos_turisticos')
            
            # Buscar todos os pontos
            pontos = list(collection.find())
            
            # Calcular estatísticas
            total_pontos = len(pontos)
            total_praias = len([p for p in pontos if p.get('categoria') == 'praia'])
            total_restaurantes = len([p for p in pontos if p.get('categoria') == 'restaurante'])
            total_hoteis = len([p for p in pontos if p.get('categoria') == 'hotel'])
            total_pousadas = len([p for p in pontos if p.get('categoria') == 'pousada'])
            
            # Calcular total de reviews e rating médio
            total_reviews = 0
            total_rating = 0
            
            for ponto in pontos:
                reviews = ponto.get('reviews', [])
                total_reviews += len(reviews)
                for review in reviews:
                    total_rating += review.get('rating', 0)
            
            avg_rating = total_rating / total_reviews if total_reviews > 0 else 0
            
            return Response({
                'total_pontos': total_pontos,
                'total_praias': total_praias,
                'total_restaurantes': total_restaurantes,
                'total_hoteis': total_hoteis,
                'total_pousadas': total_pousadas,
                'total_reviews': total_reviews,
                'avg_rating': round(avg_rating, 2)
            })
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Erro ao buscar estatísticas: {e}")
            
            # Retornar estatísticas vazias em caso de erro
            return Response({
                'total_pontos': 0,
                'total_praias': 0,
                'total_restaurantes': 0,
                'total_hoteis': 0,
                'total_pousadas': 0,
                'total_reviews': 0,
                'avg_rating': 0,
                'error': 'Erro ao conectar ao banco de dados. Verifique a conexão.'
            }, status=status.HTTP_200_OK)


class PontoTuristicoDeleteView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, ponto_id):
        """Deleta um ponto turístico (apenas admin)"""
        # Verificar se usuário é admin
        if not request.user.is_staff:
            return Response({'error': 'Apenas administradores podem deletar pontos'}, status=status.HTTP_403_FORBIDDEN)
        
        collection = mongodb.get_collection('pontos_turisticos')
        ponto = collection.find_one({'_id': ObjectId(ponto_id)})
        
        if not ponto:
            return Response({'error': 'Ponto turístico não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Deletar imagens do Cloudinary
        import cloudinary.uploader
        for imagem in ponto.get('imagens', []):
            try:
                cloudinary.uploader.destroy(imagem['public_id'])
            except:
                pass
        
        # Deletar do banco
        collection.delete_one({'_id': ObjectId(ponto_id)})
        
        return Response({'message': 'Ponto turístico deletado com sucesso'}, status=status.HTTP_200_OK)


class PontoTuristicoUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, ponto_id):
        """Atualiza um ponto turístico (apenas admin)"""
        if not request.user.is_staff:
            return Response({'error': 'Apenas administradores podem atualizar pontos'}, status=status.HTTP_403_FORBIDDEN)
        
        collection = mongodb.get_collection('pontos_turisticos')
        ponto = collection.find_one({'_id': ObjectId(ponto_id)})
        
        if not ponto:
            return Response({'error': 'Ponto turístico não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Atualizar campos permitidos
        update_data = {}
        allowed_fields = ['nome', 'descricao', 'categoria', 'preco_medio', 'horario_funcionamento', 'contato', 'imagens']
        
        for field in allowed_fields:
            if field in request.data:
                update_data[field] = request.data[field]
        
        if update_data:
            collection.update_one(
                {'_id': ObjectId(ponto_id)},
                {'$set': update_data}
            )
        
        # Retornar ponto atualizado
        ponto_atualizado = collection.find_one({'_id': ObjectId(ponto_id)})
        serializer = PontoTuristicoSerializer(ponto_atualizado)
        return Response(serializer.data)


class PontoTuristicoUploadImageView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, ponto_id):
        """Upload de imagem para um ponto turístico"""
        if not request.user.is_staff:
            return Response({'error': 'Apenas administradores podem fazer upload de imagens'}, status=status.HTTP_403_FORBIDDEN)
        
        collection = mongodb.get_collection('pontos_turisticos')
        ponto = collection.find_one({'_id': ObjectId(ponto_id)})
        
        if not ponto:
            return Response({'error': 'Ponto turístico não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Verificar se há arquivo
        if 'image' not in request.FILES:
            return Response({'error': 'Nenhuma imagem enviada'}, status=status.HTTP_400_BAD_REQUEST)
        
        image_file = request.FILES['image']
        
        # Upload para Cloudinary
        import cloudinary.uploader
        try:
            result = cloudinary.uploader.upload(
                image_file,
                folder='txopela-tour/pontos',
                transformation=[
                    {'width': 1200, 'height': 800, 'crop': 'limit'},
                    {'quality': 'auto:good'}
                ]
            )
            
            # Criar objeto de imagem
            nova_imagem = {
                'url': result['secure_url'],
                'public_id': result['public_id'],
                'alt': request.data.get('alt', ponto['nome'])
            }
            
            # Adicionar imagem ao ponto
            collection.update_one(
                {'_id': ObjectId(ponto_id)},
                {'$push': {'imagens': nova_imagem}}
            )
            
            return Response(nova_imagem, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': f'Erro ao fazer upload: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PontoTuristicoDeleteImageView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, ponto_id, public_id):
        """Remove uma imagem de um ponto turístico"""
        if not request.user.is_staff:
            return Response({'error': 'Apenas administradores podem deletar imagens'}, status=status.HTTP_403_FORBIDDEN)
        
        collection = mongodb.get_collection('pontos_turisticos')
        ponto = collection.find_one({'_id': ObjectId(ponto_id)})
        
        if not ponto:
            return Response({'error': 'Ponto turístico não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Decodificar public_id (vem como parâmetro de URL)
        import urllib.parse
        decoded_public_id = urllib.parse.unquote(public_id)
        
        # Deletar do Cloudinary
        import cloudinary.uploader
        try:
            cloudinary.uploader.destroy(decoded_public_id)
        except Exception as e:
            print(f"Erro ao deletar do Cloudinary: {e}")
        
        # Remover do banco
        collection.update_one(
            {'_id': ObjectId(ponto_id)},
            {'$pull': {'imagens': {'public_id': decoded_public_id}}}
        )
        
        return Response({'message': 'Imagem deletada com sucesso'}, status=status.HTTP_200_OK)
