from django.urls import path
from .views import (
    AdminPontoListView,
    AdminPontoCreateView,
    AdminPontoUpdateView,
    AdminPontoDeleteView,
    AdminDeleteImageView,
    AdminStatsView
)

urlpatterns = [
    path('pontos/', AdminPontoListView.as_view(), name='admin-pontos-list'),
    path('pontos/create/', AdminPontoCreateView.as_view(), name='admin-pontos-create'),
    path('pontos/<str:ponto_id>/', AdminPontoUpdateView.as_view(), name='admin-pontos-update'),
    path('pontos/<str:ponto_id>/delete/', AdminPontoDeleteView.as_view(), name='admin-pontos-delete'),
    path('pontos/<str:ponto_id>/images/<str:public_id>/', AdminDeleteImageView.as_view(), name='admin-delete-image'),
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
]
