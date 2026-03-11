from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Business, Message, MessageReply, Post, BusinessView

User = get_user_model()


class BusinessSerializer(serializers.ModelSerializer):
    owner_id = serializers.IntegerField(source='owner.id', read_only=True)
    
    class Meta:
        model = Business
        fields = ['id', 'owner_id', 'name', 'description', 'category', 'location', 
                  'images', 'contact', 'hours', 'price_range', 'verified', 'created_at']
        read_only_fields = ['id', 'owner_id', 'verified', 'created_at']


class MessageReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageReply
        fields = ['id', 'content', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    business_id = serializers.IntegerField(source='business.id', read_only=True)
    replies = MessageReplySerializer(many=True, read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'business_id', 'user_id', 'user_name', 'content', 
                  'read', 'created_at', 'replies']
        read_only_fields = ['id', 'business_id', 'user_id', 'user_name', 'created_at']


class PostSerializer(serializers.ModelSerializer):
    business_id = serializers.IntegerField(source='business.id', read_only=True)
    business_name = serializers.CharField(source='business.name', read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'business_id', 'business_name', 'title', 'content', 
                  'images', 'type', 'active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'business_id', 'business_name', 'created_at', 'updated_at']


class BusinessRegistrationSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    category = serializers.ChoiceField(choices=Business.CATEGORY_CHOICES)
    phone = serializers.CharField(max_length=50)
    description = serializers.CharField()

    def create(self, validated_data):
        # Criar usuário com role de negócio
        username = validated_data['email'].split('@')[0]
        
        # Verificar se usuário já existe
        if User.objects.filter(email=validated_data['email']).exists():
            raise serializers.ValidationError({'email': 'Este email já está cadastrado'})
        
        if User.objects.filter(username=username).exists():
            # Adicionar número ao username se já existir
            import random
            username = f"{username}{random.randint(100, 999)}"
        
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['name'],
            role='curador',  # Usar role curador para negócios
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
            }
        )
        
        return business
