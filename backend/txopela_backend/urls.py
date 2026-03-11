from django.contrib import admin
from django.urls import path, include
from pontos_turisticos.admin import ponto_admin

# Customizar o admin
admin.site.site_header = "Txopela Tour Admin"
admin.site.site_title = "Txopela Tour"
admin.site.index_title = "Painel de Administração"

urlpatterns = [
    path('admin/pontos-turisticos/', include((ponto_admin.get_urls(), 'admin'))),
    path('admin/', admin.site.urls),
    path('api/pontos-turisticos/', include('pontos_turisticos.urls')),
    path('api/ai/', include('ai_service.urls')),
    path('api/auth/', include('authentication.urls')),
    path('api/', include('business_panel.urls')),
]
