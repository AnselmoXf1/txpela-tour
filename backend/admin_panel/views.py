from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from bson import ObjectId
from datetime import datetime
import cloudinary
import cloudinary.uploader
from django.conf import settings
from pontos_turisticos.mongodb import mongodb
from pontos_turisticos.serializers import PontoTuristicoSerializer

# Configurar Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)


class AdminPontoListView(APIView):
    """Lista todos os pontos turísticos para o admin"""
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        collection = mongodb.get_collection('pontos_turisticos')
        pontos = list(collection.find())
        serializer = PontoTuristicoSerializer(pontos, many=True)
        return Response(serializer.data)


class AdminPontoCreateView(APIView):
    """Cria um novo ponto turístico"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        data = request.data.copy()
        
        # Upload de imagens para Cloudinary
        imagens = []
        files = request.FILES.getlist('imagens')
        
        for file in files:
            try:
                upload_result = cloudinary.uploader.upload(
                    file,
                    folder="txopela_tour",
                    resource_type="image"
                )
                imagens.append({
                    "url": upload_result['secure_url'],
                    "public_id": upload_result['public_id'],
                    "alt": data.get('nome', 'Imagem')
                })
            except Exception as e:
                return Response(
                    {'error': f'Erro ao fazer upload da imagem: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Preparar dados do ponto turístico
        ponto_data = {
            "nome": data.get('nome'),
            "descricao": data.get('descricao'),
            "categoria": data.get('categoria'),
            "localizacao": {
                "type": "Point",
                "coordinates": [
                    float(data.get('longitude')),
                    float(data.get('latitude'))
                ]
            },
            "imagens": imagens,
            "reviews": [],
            "preco_medio": float(data.get('preco_medio', 0)),
            "horario_funcionamento": data.get('horario_funcionamento', ''),
            "contato": data.get('contato', '')
        }
        
        # Validar com serializer
        serializer = PontoTuristicoSerializer(data=ponto_data)
        if serializer.is_valid():
            collection = mongodb.get_collection('pontos_turisticos')
            result = collection.insert_one(serializer.validated_data)
            return Response(
                {'_id': str(result.inserted_id), 'message': 'Ponto turístico criado com sucesso'},
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminPontoUpdateView(APIView):
    """Atualiza um ponto turístico existente"""
    permission_classes = [IsAuthenticated, IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def put(self, request, ponto_id):
        collection = mongodb.get_collection('pontos_turisticos')
        ponto = collection.find_one({'_id': ObjectId(ponto_id)})
        
        if not ponto:
            return Response(
                {'error': 'Ponto turístico não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        data = request.data.copy()
        
        # Upload de novas imagens se fornecidas
        imagens = ponto.get('imagens', [])
        files = request.FILES.getlist('imagens')
        
        if files:
            for file in files:
                try:
                    upload_result = cloudinary.uploader.upload(
                        file,
                        folder="txopela_tour",
                        resource_type="image"
                    )
                    imagens.append({
                        "url": upload_result['secure_url'],
                        "public_id": upload_result['public_id'],
                        "alt": data.get('nome', 'Imagem')
                    })
                except Exception as e:
                    return Response(
                        {'error': f'Erro ao fazer upload da imagem: {str(e)}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
        
        # Atualizar dados
        update_data = {}
        
        if 'nome' in data:
            update_data['nome'] = data['nome']
        if 'descricao' in data:
            update_data['descricao'] = data['descricao']
        if 'categoria' in data:
            update_data['categoria'] = data['categoria']
        if 'latitude' in data and 'longitude' in data:
            update_data['localizacao'] = {
                "type": "Point",
                "coordinates": [float(data['longitude']), float(data['latitude'])]
            }
        if 'preco_medio' in data:
            update_data['preco_medio'] = float(data['preco_medio'])
        if 'horario_funcionamento' in data:
            update_data['horario_funcionamento'] = data['horario_funcionamento']
        if 'contato' in data:
            update_data['contato'] = data['contato']
        
        update_data['imagens'] = imagens
        
        # Atualizar no banco
        collection.update_one(
            {'_id': ObjectId(ponto_id)},
            {'$set': update_data}
        )
        
        return Response({'message': 'Ponto turístico atualizado com sucesso'})


class AdminPontoDeleteView(APIView):
    """Deleta um ponto turístico"""
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request, ponto_id):
        collection = mongodb.get_collection('pontos_turisticos')
        ponto = collection.find_one({'_id': ObjectId(ponto_id)})
        
        if not ponto:
            return Response(
                {'error': 'Ponto turístico não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Deletar imagens do Cloudinary
        for imagem in ponto.get('imagens', []):
            try:
                cloudinary.uploader.destroy(imagem['public_id'])
            except Exception as e:
                print(f"Erro ao deletar imagem do Cloudinary: {e}")
        
        # Deletar do banco
        collection.delete_one({'_id': ObjectId(ponto_id)})
        
        return Response({'message': 'Ponto turístico deletado com sucesso'})


class AdminDeleteImageView(APIView):
    """Deleta uma imagem específica de um ponto turístico"""
    permission_classes = [IsAuthenticated, IsAdminUser]

    def delete(self, request, ponto_id, public_id):
        collection = mongodb.get_collection('pontos_turisticos')
        ponto = collection.find_one({'_id': ObjectId(ponto_id)})
        
        if not ponto:
            return Response(
                {'error': 'Ponto turístico não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Deletar do Cloudinary
        try:
            cloudinary.uploader.destroy(public_id)
        except Exception as e:
            return Response(
                {'error': f'Erro ao deletar imagem: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Remover da lista de imagens
        collection.update_one(
            {'_id': ObjectId(ponto_id)},
            {'$pull': {'imagens': {'public_id': public_id}}}
        )
        
        return Response({'message': 'Imagem deletada com sucesso'})


class AdminStatsView(APIView):
    """Estatísticas do painel admin"""
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        collection = mongodb.get_collection('pontos_turisticos')
        
        total_pontos = collection.count_documents({})
        total_praias = collection.count_documents({'categoria': 'praia'})
        total_restaurantes = collection.count_documents({'categoria': 'restaurante'})
        total_hoteis = collection.count_documents({'categoria': 'hotel'})
        total_pousadas = collection.count_documents({'categoria': 'pousada'})
        
        # Total de reviews
        pipeline = [
            {'$unwind': '$reviews'},
            {'$count': 'total'}
        ]
        reviews_result = list(collection.aggregate(pipeline))
        total_reviews = reviews_result[0]['total'] if reviews_result else 0
        
        # Rating médio geral
        pipeline = [
            {'$unwind': '$reviews'},
            {'$group': {'_id': None, 'avg_rating': {'$avg': '$reviews.rating'}}}
        ]
        rating_result = list(collection.aggregate(pipeline))
        avg_rating = rating_result[0]['avg_rating'] if rating_result else 0
        
        return Response({
            'total_pontos': total_pontos,
            'total_praias': total_praias,
            'total_restaurantes': total_restaurantes,
            'total_hoteis': total_hoteis,
            'total_pousadas': total_pousadas,
            'total_reviews': total_reviews,
            'avg_rating': round(avg_rating, 2)
        })
