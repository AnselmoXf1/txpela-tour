from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Count, Q
from datetime import datetime, timedelta
from .models import Business, Message, MessageReply, Post, BusinessView
from .serializers import (
    BusinessSerializer, MessageSerializer, PostSerializer,
    BusinessRegistrationSerializer, MessageReplySerializer
)

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register_business(request):
    """Cadastro de novo negócio"""
    print("Dados recebidos:", request.data)  # Debug
    serializer = BusinessRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            business = serializer.save()
            return Response({
                'message': 'Negócio cadastrado com sucesso',
                'business_id': business.id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Erro ao salvar:", str(e))  # Debug
            return Response({
                'message': f'Erro ao criar negócio: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    print("Erros de validação:", serializer.errors)  # Debug
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_business(request):
    """Login de negócio"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    print(f"Tentativa de login: {email}")  # Debug
    
    try:
        user = User.objects.get(email=email)
        print(f"Usuário encontrado: {user.username}")  # Debug
        
        user = authenticate(username=user.username, password=password)
        
        if user:
            print("Autenticação bem-sucedida")  # Debug
            
            # Verificar se tem negócio associado
            business = Business.objects.filter(owner=user).first()
            if not business:
                print("Negócio não encontrado")  # Debug
                return Response({
                    'message': 'Usuário não possui negócio cadastrado'
                }, status=status.HTTP_404_NOT_FOUND)
            
            print(f"Negócio encontrado: {business.name}")  # Debug
            
            # Gerar token JWT
            refresh = RefreshToken.for_user(user)
            
            try:
                business_data = BusinessSerializer(business).data
                print("Serialização bem-sucedida")  # Debug
            except Exception as e:
                print(f"Erro ao serializar: {e}")  # Debug
                return Response({
                    'message': f'Erro ao processar dados do negócio: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({
                'token': str(refresh.access_token),
                'business': business_data
            })
        else:
            print("Autenticação falhou")  # Debug
            return Response({
                'message': 'Credenciais inválidas'
            }, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        print("Usuário não existe")  # Debug
        return Response({
            'message': 'Usuário não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Erro inesperado: {e}")  # Debug
        return Response({
            'message': f'Erro no servidor: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def business_profile(request):
    """Obter ou atualizar perfil do negócio"""
    try:
        business = Business.objects.get(owner=request.user)
    except Business.DoesNotExist:
        return Response({
            'message': 'Negócio não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = BusinessSerializer(business)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = BusinessSerializer(business, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_location(request):
    """Atualizar localização do negócio"""
    try:
        business = Business.objects.get(owner=request.user)
    except Business.DoesNotExist:
        return Response({
            'message': 'Negócio não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    lat = request.data.get('lat')
    lng = request.data.get('lng')
    address = request.data.get('address', '')
    
    if lat is None or lng is None:
        return Response({
            'message': 'Latitude e longitude são obrigatórios'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    business.location = {
        'type': 'Point',
        'coordinates': [float(lng), float(lat)],
        'address': address
    }
    business.save()
    
    return Response({
        'message': 'Localização atualizada com sucesso',
        'location': business.location
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_messages(request):
    """Listar mensagens recebidas"""
    try:
        business = Business.objects.get(owner=request.user)
    except Business.DoesNotExist:
        return Response([], status=status.HTTP_200_OK)
    
    messages = Message.objects.filter(business=business)
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def mark_as_read(request, message_id):
    """Marcar mensagem como lida"""
    try:
        business = Business.objects.get(owner=request.user)
        message = Message.objects.get(id=message_id, business=business)
        message.read = True
        message.save()
        return Response({'message': 'Mensagem marcada como lida'})
    except (Business.DoesNotExist, Message.DoesNotExist):
        return Response({
            'message': 'Mensagem não encontrada'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reply_message(request, message_id):
    """Responder mensagem"""
    try:
        business = Business.objects.get(owner=request.user)
        message = Message.objects.get(id=message_id, business=business)
        
        content = request.data.get('content')
        if not content:
            return Response({
                'message': 'Conteúdo é obrigatório'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        reply = MessageReply.objects.create(
            message=message,
            content=content
        )
        
        return Response({
            'message': 'Resposta enviada com sucesso',
            'reply': MessageReplySerializer(reply).data
        })
    except (Business.DoesNotExist, Message.DoesNotExist):
        return Response({
            'message': 'Mensagem não encontrada'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_create_posts(request):
    """Listar ou criar posts"""
    try:
        business = Business.objects.get(owner=request.user)
    except Business.DoesNotExist:
        return Response({
            'message': 'Negócio não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        posts = Post.objects.filter(business=business)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(business=business)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_post(request, post_id):
    """Atualizar ou excluir post"""
    try:
        business = Business.objects.get(owner=request.user)
        post = Post.objects.get(id=post_id, business=business)
    except (Business.DoesNotExist, Post.DoesNotExist):
        return Response({
            'message': 'Post não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        post.delete()
        return Response({'message': 'Post excluído com sucesso'})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def toggle_post(request, post_id):
    """Ativar/desativar post"""
    try:
        business = Business.objects.get(owner=request.user)
        post = Post.objects.get(id=post_id, business=business)
        post.active = not post.active
        post.save()
        return Response({
            'message': 'Status do post atualizado',
            'active': post.active
        })
    except (Business.DoesNotExist, Post.DoesNotExist):
        return Response({
            'message': 'Post não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stats_overview(request):
    """Estatísticas gerais do negócio"""
    try:
        business = Business.objects.get(owner=request.user)
    except Business.DoesNotExist:
        return Response({
            'views': 0,
            'messages': 0,
            'posts': 0,
            'growth': 0,
            'recent_activity': []
        })
    
    # Contar estatísticas
    total_views = BusinessView.objects.filter(business=business).count()
    total_messages = Message.objects.filter(business=business).count()
    unread_messages = Message.objects.filter(business=business, read=False).count()
    active_posts = Post.objects.filter(business=business, active=True).count()
    
    # Calcular crescimento (últimos 7 dias vs 7 dias anteriores)
    today = datetime.now()
    last_week = today - timedelta(days=7)
    prev_week = today - timedelta(days=14)
    
    views_last_week = BusinessView.objects.filter(
        business=business,
        viewed_at__gte=last_week
    ).count()
    
    views_prev_week = BusinessView.objects.filter(
        business=business,
        viewed_at__gte=prev_week,
        viewed_at__lt=last_week
    ).count()
    
    growth = 0
    if views_prev_week > 0:
        growth = round(((views_last_week - views_prev_week) / views_prev_week) * 100, 1)
    
    # Atividade recente
    recent_activity = []
    recent_messages = Message.objects.filter(business=business).order_by('-created_at')[:3]
    for msg in recent_messages:
        recent_activity.append({
            'message': f'Nova mensagem de {msg.user.get_full_name() or msg.user.username}',
            'time': msg.created_at
        })
    
    return Response({
        'views': total_views,
        'messages': unread_messages,
        'posts': active_posts,
        'growth': growth,
        'recent_activity': recent_activity
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stats_views(request):
    """Visualizações por período"""
    try:
        business = Business.objects.get(owner=request.user)
    except Business.DoesNotExist:
        return Response({'data': []})
    
    period = request.GET.get('period', 'week')
    
    if period == 'week':
        days = 7
    elif period == 'month':
        days = 30
    else:
        days = 365
    
    start_date = datetime.now() - timedelta(days=days)
    
    views = BusinessView.objects.filter(
        business=business,
        viewed_at__gte=start_date
    ).extra(
        select={'day': 'date(viewed_at)'}
    ).values('day').annotate(count=Count('id')).order_by('day')
    
    return Response({'data': list(views)})


# Views públicas para o app cliente
@api_view(['GET'])
@permission_classes([AllowAny])
def public_posts(request):
    """Listar posts ativos (para app cliente)"""
    posts = Post.objects.filter(active=True).select_related('business')
    post_type = request.GET.get('type')
    
    if post_type:
        posts = posts.filter(type=post_type)
    
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_businesses(request):
    """Listar negócios (para app cliente)"""
    businesses = Business.objects.filter(location__isnull=False)
    category = request.GET.get('category')
    
    if category:
        businesses = businesses.filter(category=category)
    
    serializer = BusinessSerializer(businesses, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message_to_business(request, business_id):
    """Enviar mensagem para negócio (do app cliente)"""
    try:
        business = Business.objects.get(id=business_id)
    except Business.DoesNotExist:
        return Response({
            'message': 'Negócio não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    content = request.data.get('content')
    if not content:
        return Response({
            'message': 'Conteúdo é obrigatório'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    message = Message.objects.create(
        business=business,
        user=request.user,
        content=content
    )
    
    return Response({
        'message': 'Mensagem enviada com sucesso',
        'data': MessageSerializer(message).data
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def track_business_view(request, business_id):
    """Registrar visualização de negócio"""
    try:
        business = Business.objects.get(id=business_id)
        user = request.user if request.user.is_authenticated else None
        
        BusinessView.objects.create(
            business=business,
            user=user
        )
        
        return Response({'message': 'Visualização registrada'})
    except Business.DoesNotExist:
        return Response({
            'message': 'Negócio não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
