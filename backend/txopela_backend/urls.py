from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from pontos_turisticos.admin import ponto_admin

# Customizar o admin
admin.site.site_header = "Txopela Tour Admin"
admin.site.site_title = "Txopela Tour"
admin.site.index_title = "Painel de Administração"

def api_root(request):
    """Endpoint raiz da API"""
    return JsonResponse({
        'status': 'online',
        'message': 'Txopela Tour API',
        'version': '1.0',
        'endpoints': {
            'pontos_turisticos': '/api/pontos-turisticos/',
            'ai_chat': '/api/ai/chat/',
            'authentication': '/api/auth/',
            'business_panel': '/api/business/',
            'admin': '/admin/'
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/pontos-turisticos/', include((ponto_admin.get_urls(), 'admin'))),
    path('admin/', admin.site.urls),
    path('api/pontos-turisticos/', include('pontos_turisticos.urls')),
    path('api/ai/', include('ai_service.urls')),
    path('api/auth/', include('authentication.urls')),
    path('api/', include('business_panel.urls')),
]
