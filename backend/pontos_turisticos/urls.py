from django.urls import path
from .views import (
    PontoTuristicoListView,
    PontoTuristicoDetailView,
    PontoTuristicoSearchView,
    PontoTuristicoNearbyView,
    AddReviewView,
    PontoTuristicoStatsView,
    PontoTuristicoDeleteView,
    PontoTuristicoUpdateView,
    PontoTuristicoUploadImageView,
    PontoTuristicoDeleteImageView
)

urlpatterns = [
    path('', PontoTuristicoListView.as_view(), name='pontos-list'),
    path('stats/', PontoTuristicoStatsView.as_view(), name='pontos-stats'),
    path('search/', PontoTuristicoSearchView.as_view(), name='pontos-search'),
    path('nearby/', PontoTuristicoNearbyView.as_view(), name='pontos-nearby'),
    path('<str:ponto_id>/', PontoTuristicoDetailView.as_view(), name='ponto-detail'),
    path('<str:ponto_id>/update/', PontoTuristicoUpdateView.as_view(), name='ponto-update'),
    path('<str:ponto_id>/review/', AddReviewView.as_view(), name='add-review'),
    path('<str:ponto_id>/delete/', PontoTuristicoDeleteView.as_view(), name='ponto-delete'),
    path('<str:ponto_id>/upload-image/', PontoTuristicoUploadImageView.as_view(), name='ponto-upload-image'),
    path('<str:ponto_id>/delete-image/<path:public_id>/', PontoTuristicoDeleteImageView.as_view(), name='ponto-delete-image'),
]
