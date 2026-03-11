from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, JSONParser
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Count, Q, Sum, F, Avg
from django.utils import timezone
from datetime import datetime, timedelta
import uuid

from .improved_models import (
    Business, BusinessReview, Conversation, Message, 
    Post, PostInteraction, Notification, BusinessAnalytics
)
from .improved_serializers import (
    BusinessSerializer, BusinessReviewSerializer, ConversationSerializer,
    MessageSerializer, PostSerializer, PostInteractionSerializer,
    NotificationSerializer, BusinessAnalyticsSerializer,
    BusinessRegistrationSerializer, ImageUploadSerializer
)

User = get_user_model()


class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.action == 'list':
            return Business.objects.filter(verified=True)
        return Business.objects.filter(owner=self.request.user)
    
    @action(detail=False, methods=['get'])
    def mine(self, request):
        business = Business.objects.filter(owner=request.user).first()
        if not business:
            return Response({'message': 'Nenhum negócio encontrado'}, status=404)
        serializer = self.get_serializer(business)
        return Response(serializer.data)
    
    @action(detail=True, methods=['put'])
    def update_location(self, request, pk=None):
        business = self.get_object()
        location = request.data.get('location')
        if location:
            business.location = location
            business.save()
            return Response({'message': 'Localização atualizada'})
        return Response({'error': 'Localização é obrigatória'}, status=400)
    
    @action(detail=True, methods=['post'])
    def upload_image(self, request, pk=None):
        business = self.get_object()
        serializer = ImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            image = serializer.validated_data['image']
            # Aqui você implementaria upload para Cloudinary/S3
            image_url = f"/media/{image.name}"  # Placeholder
            business.images.append(image_url)
            business.save()
            return Response({'image_url': image_url})
        return Response(serializer.errors, status=400)


class BusinessReviewViewSet(viewsets.ModelViewSet):
    queryset = BusinessReview.objects.all()
    serializer_class = BusinessReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        business_id = self.request.query_params.get('business_id')
        if business_id:
            return BusinessReview.objects.filter(business_id=business_id)
        return BusinessReview.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        business_id = self.request.data.get('business_id')
        business = Business.objects.get(id=business_id)
        serializer.save(user=self.request.user, business=business)


class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(
            Q(business__owner=self.request.user) | Q(user=self.request.user)
        ).distinct()
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        messages = conversation.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        content = request.data.get('content')
        images = request.data.get('images', [])
        
        if not content and not images:
            return Response({'error': 'Conteúdo ou imagem é obrigatório'}, status=400)
        
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=content,
            images=images
        )
        
        # Criar notificação
        if request.user != conversation.business.owner:
            Notification.objects.create(
                user=conversation.business.owner,
                business=conversation.business,
                type='message',
                title='Nova Mensagem',
                message=f'{request.user.get_full_name()} enviou uma mensagem',
                data={'conversation_id': str(conversation.id), 'message_id': str(message.id)}
            )
        
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=201)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        conversation = self.get_object()
        conversation.messages.filter(read=False).update(read=True)
        conversation.unread_count = 0
        conversation.save()
        return Response({'message': 'Mensagens marcadas como lidas'})


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(active=True)
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            business = Business.objects.filter(owner=self.request.user).first()
            if business and self.action in ['list', 'retrieve']:
                return Post.objects.filter(business=business)
        return Post.objects.filter(active=True)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def perform_create(self, serializer):
        business = Business.objects.filter(owner=self.request.user).first()
        if not business:
            raise serializers.ValidationError('Você não possui um negócio')
        serializer.save(business=business)
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        interaction, created = PostInteraction.objects.get_or_create(
            post=post,
            user=request.user,
            defaults={'liked': True}
        )
        
        if not created:
            interaction.liked = not interaction.liked
            interaction.save()
        
        if interaction.liked:
            post.likes = F('likes') + 1
        else:
            post.likes = F('likes') - 1
        post.save(update_fields=['likes'])
        
        return Response({'liked': interaction.liked, 'total_likes': post.likes})
    
    @action(detail=True, methods=['post'])
    def save_post(self, request, pk=None):
        post = self.get_object()
        interaction, created = PostInteraction.objects.get_or_create(
            post=post,
            user=request.user,
            defaults={'saved': True}
        )
        
        if not created:
            interaction.saved = not interaction.saved
            interaction.save()
        
        return Response({'saved': interaction.saved})
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        post = self.get_object()
        post.shares = F('shares') + 1
        post.save(update_fields=['shares'])
        
        interaction, _ = PostInteraction.objects.get_or_create(
            post=post,
            user=request.user
        )
        interaction.shared = True
        interaction.save()
        
        return Response({'shared': True, 'total_shares': post.shares})
    
    @action(detail=True, methods=['post'])
    def upload_images(self, request, pk=None):
        post = self.get_object()
        images = request.data.get('images', [])
        if images:
            post.images.extend(images)
            post.save()
            return Response({'message': 'Imagens adicionadas'})
        return Response({'error': 'Nenhuma imagem fornecida'}, status=400)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        Notification.objects.filter(user=request.user, read=False).update(read=True)
        return Response({'message': 'Todas as notificações marcadas como lidas'})
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.read = True
        notification.save()
        return Response({'message': 'Notificação marcada como lida'})


class BusinessAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BusinessAnalytics.objects.all()
    serializer_class = BusinessAnalyticsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        business = Business.objects.filter(owner=self.request.user).first()
        if not business:
            return BusinessAnalytics.objects.none()
        
        period = self.request.query_params.get('period', 'week')
        end_date = timezone.now().date()
        
        if period == 'week':
            start_date = end_date - timedelta(days=7)
        elif period == 'month':
            start_date = end_date - timedelta(days=30)
        elif period == 'year':
            start_date = end_date - timedelta(days=365)
        else:
            start_date = end_date - timedelta(days=7)
        
        return BusinessAnalytics.objects.filter(
            business=business,
            date__range=[start_date, end_date]
        )
    
    @action(detail=False, methods=['get'])
    def overview(self, request):
        business = Business.objects.filter(owner=request.user).first()
        if not business:
            return Response({'error': 'Nenhum negócio encontrado'}, status=404)
        
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        # Estatísticas gerais
        total_views = business.views.count()
        total_messages = Conversation.objects.filter(business=business).count()
        total_reviews = business.reviews.count()
        total_posts = business.posts.filter(active=True).count()
        
        # Crescimento
        views_this_week = business.views.filter(viewed_at__date__gte=week_ago).count()
        views_last_week = business.views.filter(
            viewed_at__date__range=[week_ago - timedelta(days=7), week_ago]
        ).count()
        
        growth = 0
        if views_last_week > 0:
            growth = ((views_this_week - views_last_week) / views_last_week) * 100
        
        # Posts mais populares
        popular_posts = business.posts.filter(active=True).order_by('-views')[:5]
        popular_posts_data = PostSerializer(popular_posts, many=True, context={'request': request}).data
        
        # Conversas recentes
        recent_conversations = Conversation.objects.filter(business=business).order_by('-last_message_at')[:5]
        recent_conversations_data = ConversationSerializer(recent_conversations, many=True).data
        
        return Response({
            'overview': {
                'views': total_views,
                'messages': total_messages,
                'reviews': total_reviews,
                'posts': total_posts,
                'growth': round(growth, 1),
                'rating': business.rating,
            },
            'popular_posts': popular_posts_data,
            'recent_conversations': recent_conversations_data,
        })


# Views de API para registro e login
@api_view(['POST'])
@permission_classes([AllowAny])
def register_business(request):
    serializer = BusinessRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            business = serializer.save()
            return Response({
                'message': 'Negócio cadastrado com sucesso',
                'business_id': str(business.id)
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'message': f'Erro ao criar negócio: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_business(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(email=email)
        user = authenticate(username=user.username, password=password)
        
        if user:
            business = Business.objects.filter(owner=user).first()
            if not business:
                return Response({
                    'message': 'Usuário não possui negócio cadastrado'
                }, status=status.HTTP_404_NOT_FOUND)
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'business': BusinessSerializer(business).data,
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'name': user.get_full_name(),
                    'role': user.role,
                }
            })
        else:
            return Response({
                'message': 'Credenciais inválidas'
            }, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({
            'message': 'Usuário não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'message': f'Erro no servidor: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Views públicas para app cliente
@api_view(['GET'])
@permission_classes([AllowAny])
def public_posts(request):
    posts = Post.objects.filter(active=True).select_related('business')
    
    # Filtros
    post_type = request.GET.get('type')
    category = request.GET.get('category')
    business_id = request.GET.get('business_id')
    
    if post_type:
        posts = posts.filter(type=post_type)
    if category:
        posts = posts.filter(business__category=category)
    if business_id:
        posts = posts.filter(business_id=business_id)
    
    # Ordenação
    sort = request.GET.get('sort', 'recent')
    if sort == 'popular':
        posts = posts.order_by('-views', '-likes')
    elif sort == 'featured':
        posts = posts.filter(featured=True).order_by('-created_at')
    else:
        posts = posts.order_by('-created_at')
    
    serializer = PostSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_businesses(request):
    businesses = Business.objects.filter(verified=True)
    
    # Filtros
    category = request.GET.get('category')
    search = request.GET.get('search')
    near = request.GET.get('near')  # lat,lng,radius
    
    if category:
        businesses = businesses.filter(category=category)
    if search:
        businesses = businesses.filter(
            Q(name__icontains=search) | 
            Q(description__icontains=search)
        )
    
    # Ordenação
    sort = request.GET.get('sort', 'rating')
    if sort == 'rating':
        businesses = businesses.order_by('-rating', '-total_reviews')
    elif sort == 'recent':
        businesses = businesses.order_by('-created_at')
    elif sort == 'name':
        businesses = businesses.order_by('name')
    
    serializer = BusinessSerializer(businesses, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_conversation(request, business_id):
    try:
        business = Business.objects.get(id=business_id)
    except Business.DoesNotExist:
        return Response({'error': 'Negócio não encontrado'}, status=404)
    
    # Verificar se já existe conversa
    conversation, created = Conversation.objects.get_or_create(
        business=business,
        user=request.user
    )
    
    # Enviar mensagem inicial se for nova conversa
    if created and request.data.get('message'):
        Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=request.data.get('message')
        )
    
    serializer = ConversationSerializer(conversation)
    return Response(serializer.data, status=201 if created else 200)


@api_view(['POST'])
@permission_classes([AllowAny])
def track_view(request, business_id):
    try:
        business = Business.objects.get(id=business_id)
    except Business.DoesNotExist:
        return Response({'error': 'Negócio não encontrado'}, status=404)
    
    user = request.user if request.user.is_authenticated else None
    
    BusinessView.objects.create(
        business=business,
        user=user,
        ip_address=request.META.get('REMOTE_ADDR'),
        user_agent=request.META.get('HTTP_USER_AGENT', '')
    )
    
    # Atualizar analytics
    today = timezone.now().date()
    analytics, _ = BusinessAnalytics.objects.get_or_create(
        business=business,
        date=today,
        defaults={'views': 0}
    )
    analytics.views += 1
    analytics.save()
    
    return Response({'message': 'Visualização registrada'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def track_post_view(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({'error': 'Post não encontrado'}, status=404)
    
    post.views += 1
    post.save()
    
    # Atualizar analytics do business
    today = timezone.now().date()
    analytics, _ = BusinessAnalytics.objects.get_or_create(
        business=post.business,
        date=today,
        defaults={'post_views': 0}
    )
    analytics.post_views += 1
    analytics.save()
    
    return Response({'message': 'Visualização registrada'})