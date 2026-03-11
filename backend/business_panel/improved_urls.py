from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .improved_views import (
    BusinessViewSet, BusinessReviewViewSet, ConversationViewSet,
    PostViewSet, NotificationViewSet, BusinessAnalyticsViewSet,
    register_business, login_business, public_posts, public_businesses,
    start_conversation, track_view, track_post_view
)

router = DefaultRouter()
router.register(r'businesses', BusinessViewSet, basename='business')
router.register(r'reviews', BusinessReviewViewSet, basename='review')
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'analytics', BusinessAnalyticsViewSet, basename='analytics')

urlpatterns = [
    # Autenticação
    path('business/register/', register_business, name='register_business'),
    path('business/login/', login_business, name='login_business'),
    
    # APIs públicas (app cliente)
    path('public/posts/', public_posts, name='public_posts'),
    path('public/businesses/', public_businesses, name='public_businesses'),
    path('businesses/<uuid:business_id>/conversation/', start_conversation, name='start_conversation'),
    path('businesses/<uuid:business_id>/view/', track_view, name='track_view'),
    path('posts/<uuid:post_id>/view/', track_post_view, name='track_post_view'),
    
    # APIs privadas (business app)
    path('', include(router.urls)),
]

# URLs específicas para business
business_urls = [
    path('profile/', BusinessViewSet.as_view({'get': 'retrieve', 'put': 'update'}), name='business_profile'),
    path('location/', BusinessViewSet.as_view({'put': 'update_location'}), name='update_location'),
    path('upload-image/', BusinessViewSet.as_view({'post': 'upload_image'}), name='upload_image'),
]

# URLs específicas para posts
post_urls = [
    path('<uuid:pk>/like/', PostViewSet.as_view({'post': 'like'}), name='post_like'),
    path('<uuid:pk>/save/', PostViewSet.as_view({'post': 'save_post'}), name='post_save'),
    path('<uuid:pk>/share/', PostViewSet.as_view({'post': 'share'}), name='post_share'),
    path('<uuid:pk>/upload-images/', PostViewSet.as_view({'post': 'upload_images'}), name='post_upload_images'),
]

# URLs específicas para conversas
conversation_urls = [
    path('<uuid:pk>/messages/', ConversationViewSet.as_view({'get': 'messages'}), name='conversation_messages'),
    path('<uuid:pk>/send/', ConversationViewSet.as_view({'post': 'send_message'}), name='send_message'),
    path('<uuid:pk>/read/', ConversationViewSet.as_view({'post': 'mark_as_read'}), name='mark_as_read'),
]

# URLs específicas para notificações
notification_urls = [
    path('read-all/', NotificationViewSet.as_view({'post': 'mark_all_as_read'}), name='mark_all_notifications_read'),
    path('<uuid:pk>/read/', NotificationViewSet.as_view({'post': 'mark_as_read'}), name='mark_notification_read'),
]

# URLs específicas para analytics
analytics_urls = [
    path('overview/', BusinessAnalyticsViewSet.as_view({'get': 'overview'}), name='analytics_overview'),
]

# Adicionar URLs específicas ao router
urlpatterns += [
    path('business/', include(business_urls)),
    path('posts/', include(post_urls)),
    path('conversations/', include(conversation_urls)),
    path('notifications/', include(notification_urls)),
    path('analytics/', include(analytics_urls)),
]