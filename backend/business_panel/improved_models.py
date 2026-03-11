from django.db import models
from django.conf import settings
import uuid


class Business(models.Model):
    CATEGORY_CHOICES = [
        ('restaurant', 'Restaurante'),
        ('hotel', 'Hotel/Pousada'),
        ('tour_guide', 'Guia Turístico'),
        ('shop', 'Loja'),
        ('service', 'Serviço'),
        ('bar', 'Bar'),
        ('cafe', 'Café'),
        ('museum', 'Museu'),
        ('park', 'Parque'),
        ('beach', 'Praia'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='businesses')
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    location = models.JSONField(null=True, blank=True)
    images = models.JSONField(default=list, blank=True)
    contact = models.JSONField(default=dict)
    hours = models.CharField(max_length=200, blank=True)
    price_range = models.CharField(max_length=10, blank=True)
    verified = models.BooleanField(default=False)
    rating = models.FloatField(default=0.0)
    total_reviews = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Business'
        verbose_name_plural = 'Businesses'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['verified']),
            models.Index(fields=['rating']),
        ]

    def __str__(self):
        return self.name

    def update_rating(self):
        reviews = self.reviews.all()
        if reviews:
            self.rating = sum(r.rating for r in reviews) / len(reviews)
            self.total_reviews = len(reviews)
            self.save()


class BusinessReview(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='business_reviews')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    images = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['business', 'user']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.business.update_rating()


class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='conversations')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversations')
    last_message = models.TextField(blank=True)
    last_message_at = models.DateTimeField(auto_now=True)
    unread_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-last_message_at']
        unique_together = ['business', 'user']

    def __str__(self):
        return f"Conversa: {self.user.username} - {self.business.name}"


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    images = models.JSONField(default=list, blank=True)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.conversation.last_message = self.content[:100]
        self.conversation.last_message_at = self.created_at
        if self.sender != self.conversation.business.owner:
            self.conversation.unread_count += 1
        self.conversation.save()


class Post(models.Model):
    TYPE_CHOICES = [
        ('promotion', 'Promoção'),
        ('event', 'Evento'),
        ('news', 'Notícia'),
        ('menu', 'Cardápio'),
        ('service', 'Serviço'),
        ('announcement', 'Anúncio'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=200)
    content = models.TextField()
    images = models.JSONField(default=list, blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    active = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    shares = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['type']),
            models.Index(fields=['active']),
            models.Index(fields=['featured']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.business.name}"


class PostInteraction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='interactions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='post_interactions')
    liked = models.BooleanField(default=False)
    shared = models.BooleanField(default=False)
    saved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['post', 'user']


class BusinessView(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='views')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-viewed_at']


class Notification(models.Model):
    TYPE_CHOICES = [
        ('message', 'Nova Mensagem'),
        ('review', 'Nova Avaliação'),
        ('booking', 'Nova Reserva'),
        ('like', 'Curtida'),
        ('comment', 'Comentário'),
        ('system', 'Sistema'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    business = models.ForeignKey(Business, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    data = models.JSONField(default=dict, blank=True)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class BusinessAnalytics(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='analytics')
    date = models.DateField()
    views = models.IntegerField(default=0)
    messages = models.IntegerField(default=0)
    reviews = models.IntegerField(default=0)
    post_views = models.IntegerField(default=0)
    post_likes = models.IntegerField(default=0)
    post_shares = models.IntegerField(default=0)
    revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        unique_together = ['business', 'date']
        ordering = ['-date']