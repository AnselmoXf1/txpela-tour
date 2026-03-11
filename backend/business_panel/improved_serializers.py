from rest_framework import serializers
from django.contrib.auth import get_user_model
from .improved_models import (
    Business, BusinessReview, Conversation, Message, 
    Post, PostInteraction, Notification, BusinessAnalytics
)
import uuid

User = get_user_model()


class BusinessSerializer(serializers.ModelSerializer):
    owner_id = serializers.UUIDField(source='owner.id', read_only=True)
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = Business
        fields = [
            'id', 'owner_id', 'owner_name', 'name', 'description', 
            'category', 'category_display', 'location', 'images', 
            'contact', 'hours', 'price_range', 'verified', 'rating',
            'total_reviews', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner_id', 'owner_name', 'verified', 
                           'rating', 'total_reviews', 'created_at', 'updated_at']


class BusinessReviewSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source='user.id', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_avatar = serializers.SerializerMethodField()
    business_id = serializers.UUIDField(source='business.id', read_only=True)
    
    class Meta:
        model = BusinessReview
        fields = [
            'id', 'business_id', 'user_id', 'user_name', 'user_avatar',
            'rating', 'comment', 'images', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'business_id', 'user_id', 'user_name', 
                           'user_avatar', 'created_at', 'updated_at']
    
    def get_user_avatar(self, obj):
        # Implementar lógica de avatar do usuário
        return None


class ConversationSerializer(serializers.ModelSerializer):
    business_id = serializers.UUIDField(source='business.id', read_only=True)
    business_name = serializers.CharField(source='business.name', read_only=True)
    business_avatar = serializers.SerializerMethodField()
    user_id = serializers.UUIDField(source='user.id', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'business_id', 'business_name', 'business_avatar',
            'user_id', 'user_name', 'user_avatar', 'last_message',
            'last_message_at', 'unread_count', 'created_at'
        ]
        read_only_fields = ['id', 'business_id', 'business_name', 'business_avatar',
                           'user_id', 'user_name', 'user_avatar', 'last_message',
                           'last_message_at', 'unread_count', 'created_at']
    
    def get_business_avatar(self, obj):
        if obj.business.images:
            return obj.business.images[0].get('url') if isinstance(obj.business.images[0], dict) else obj.business.images[0]
        return None
    
    def get_user_avatar(self, obj):
        return None


class MessageSerializer(serializers.ModelSerializer):
    conversation_id = serializers.UUIDField(source='conversation.id', read_only=True)
    sender_id = serializers.UUIDField(source='sender.id', read_only=True)
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    sender_type = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = [
            'id', 'conversation_id', 'sender_id', 'sender_name', 'sender_type',
            'content', 'images', 'read', 'created_at'
        ]
        read_only_fields = ['id', 'conversation_id', 'sender_id', 'sender_name',
                           'sender_type', 'created_at']
    
    def get_sender_type(self, obj):
        return 'business' if obj.sender == obj.conversation.business.owner else 'user'


class PostSerializer(serializers.ModelSerializer):
    business_id = serializers.UUIDField(source='business.id', read_only=True)
    business_name = serializers.CharField(source='business.name', read_only=True)
    business_avatar = serializers.SerializerMethodField()
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    user_liked = serializers.SerializerMethodField()
    user_saved = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = [
            'id', 'business_id', 'business_name', 'business_avatar',
            'title', 'content', 'images', 'type', 'type_display',
            'active', 'featured', 'views', 'likes', 'shares',
            'user_liked', 'user_saved', 'created_at', 'updated_at',
            'expires_at'
        ]
        read_only_fields = ['id', 'business_id', 'business_name', 'business_avatar',
                           'type_display', 'views', 'likes', 'shares',
                           'user_liked', 'user_saved', 'created_at', 'updated_at']
    
    def get_business_avatar(self, obj):
        if obj.business.images:
            return obj.business.images[0].get('url') if isinstance(obj.business.images[0], dict) else obj.business.images[0]
        return None
    
    def get_user_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.interactions.filter(user=request.user, liked=True).exists()
        return False
    
    def get_user_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.interactions.filter(user=request.user, saved=True).exists()
        return False


class PostInteractionSerializer(serializers.ModelSerializer):
    post_id = serializers.UUIDField(source='post.id', read_only=True)
    user_id = serializers.UUIDField(source='user.id', read_only=True)
    
    class Meta:
        model = PostInteraction
        fields = ['id', 'post_id', 'user_id', 'liked', 'shared', 'saved', 'created_at']
        read_only_fields = ['id', 'post_id', 'user_id', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    business_id = serializers.UUIDField(source='business.id', read_only=True, allow_null=True)
    business_name = serializers.CharField(source='business.name', read_only=True, allow_null=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'business_id', 'business_name', 'type', 'type_display',
            'title', 'message', 'data', 'read', 'created_at'
        ]
        read_only_fields = ['id', 'business_id', 'business_name', 'type_display', 'created_at']


class BusinessAnalyticsSerializer(serializers.ModelSerializer):
    business_id = serializers.UUIDField(source='business.id', read_only=True)
    
    class Meta:
        model = BusinessAnalytics
        fields = [
            'id', 'business_id', 'date', 'views', 'messages', 'reviews',
            'post_views', 'post_likes', 'post_shares', 'revenue'
        ]
        read_only_fields = ['id', 'business_id']


class BusinessRegistrationSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    category = serializers.ChoiceField(choices=Business.CATEGORY_CHOICES)
    phone = serializers.CharField(max_length=50)
    description = serializers.CharField()
    location = serializers.JSONField(required=False, allow_null=True)
    images = serializers.JSONField(required=False, default=list)

    def create(self, validated_data):
        # Criar usuário com role de negócio
        username = validated_data['email'].split('@')[0]
        
        # Verificar se usuário já existe
        if User.objects.filter(email=validated_data['email']).exists():
            raise serializers.ValidationError({'email': 'Este email já está cadastrado'})
        
        if User.objects.filter(username=username).exists():
            import random
            username = f"{username}{random.randint(100, 999)}"
        
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['name'],
            role='curador',
            telefone=validated_data['phone']
        )
        
        # Criar business
        business = Business.objects.create(
            owner=user,
            name=validated_data['name'],
            description=validated_data['description'],
            category=validated_data['category'],
            contact={
                'phone': validated_data['phone'],
                'email': validated_data['email']
            },
            location=validated_data.get('location'),
            images=validated_data.get('images', [])
        )
        
        return business


class ImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()
    type = serializers.ChoiceField(choices=['business', 'post', 'review', 'message'])
    object_id = serializers.UUIDField(required=False)
    
    def validate(self, data):
        if data['type'] in ['post', 'review', 'message'] and not data.get('object_id'):
            raise serializers.ValidationError(
                f"object_id é obrigatório para tipo {data['type']}"
            )
        return data