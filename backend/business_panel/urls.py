from django.urls import path
from . import views

urlpatterns = [
    # Autenticação
    path('business/register/', views.register_business, name='register_business'),
    path('business/login/', views.login_business, name='login_business'),
    
    # Perfil
    path('business/profile/', views.business_profile, name='business_profile'),
    path('business/location/', views.update_location, name='update_location'),
    
    # Mensagens
    path('business/messages/', views.list_messages, name='list_messages'),
    path('business/messages/<int:message_id>/read/', views.mark_as_read, name='mark_as_read'),
    path('business/messages/<int:message_id>/reply/', views.reply_message, name='reply_message'),
    
    # Posts
    path('business/posts/', views.list_create_posts, name='list_create_posts'),
    path('business/posts/<int:post_id>/', views.manage_post, name='manage_post'),
    path('business/posts/<int:post_id>/toggle/', views.toggle_post, name='toggle_post'),
    
    # Estatísticas
    path('business/stats/overview/', views.stats_overview, name='stats_overview'),
    path('business/stats/views/', views.stats_views, name='stats_views'),
    
    # APIs públicas (para app cliente)
    path('posts/', views.public_posts, name='public_posts'),
    path('businesses/', views.public_businesses, name='public_businesses'),
    path('businesses/<int:business_id>/message/', views.send_message_to_business, name='send_message'),
    path('businesses/<int:business_id>/view/', views.track_business_view, name='track_view'),
]
