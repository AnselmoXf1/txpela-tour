from django.db import models
from django.contrib.auth.models import User


class Business(models.Model):
    CATEGORY_CHOICES = [
        ('restaurant', 'Restaurante'),
        ('hotel', 'Hotel/Pousada'),
        ('tour_guide', 'Guia Turístico'),
        ('shop', 'Loja'),
        ('service', 'Serviço'),
    ]
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='businesses')
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    location = models.JSONField(null=True, blank=True)  # {type: 'Point', coordinates: [lng, lat], address: ''}
    images = models.JSONField(default=list, blank=True)
    contact = models.JSONField(default=dict)  # {phone, email, website}
    hours = models.CharField(max_length=200, blank=True)
    price_range = models.CharField(max_length=10, blank=True)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Businesses'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class Message(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    user_name = models.CharField(max_length=200)
    content = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Message from {self.user_name} to {self.business.name}"


class MessageReply(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='replies')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Reply to message {self.message.id}"


class Post(models.Model):
    TYPE_CHOICES = [
        ('promotion', 'Promoção'),
        ('event', 'Evento'),
        ('news', 'Notícia'),
    ]
    
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=200)
    content = models.TextField()
    images = models.JSONField(default=list, blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.business.name}"


class BusinessView(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='views')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-viewed_at']
