# Txopela Business App - Configuração

## ✅ O que foi criado

### 1. Estrutura do Projeto
- Aplicação React + TypeScript + Vite
- Configuração Tailwind CSS
- Integração com Leaflet para mapas
- Sistema de rotas com React Router

### 2. Páginas Implementadas

#### Login & Registro
- Tela de login para negócios
- Formulário de cadastro com categorias (restaurante, hotel, guia, loja, serviço)

#### Dashboard
- Estatísticas: visualizações, mensagens, posts, crescimento
- Atividade recente
- Status do perfil (verificado, localização configurada)

#### Localização
- Mapa interativo (Leaflet)
- Clique no mapa para marcar localização
- Campo de endereço
- Salva coordenadas (lat/lng)

#### Mensagens
- Lista de mensagens de clientes
- Visualização de mensagens
- Marcar como lida automaticamente
- Responder mensagens

#### Posts
- Criar posts (promoções, eventos, notícias)
- Editar e excluir posts
- Ativar/desativar posts
- Posts aparecem no app do cliente

#### Perfil
- Editar informações do negócio
- Contato (telefone, email, website)
- Horário de funcionamento
- Faixa de preço

### 3. Serviços de API
Todos os endpoints necessários estão mapeados em `src/services/api.ts`

### 4. Context API
- `BusinessContext` para gerenciar estado global do negócio
- Autenticação com JWT (token separado: `business_token`)

## 🔧 Próximos Passos

### 1. Instalar Dependências
```bash
cd business-app
npm install
```

### 2. Implementar Backend (Django)

Criar novo app Django chamado `business`:

```bash
cd backend
python manage.py startapp business
```

#### Modelos necessários:

**Business** (models.py):
```python
class Business(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=[
        ('restaurant', 'Restaurante'),
        ('hotel', 'Hotel'),
        ('tour_guide', 'Guia Turístico'),
        ('shop', 'Loja'),
        ('service', 'Serviço'),
    ])
    location = models.JSONField(null=True)  # {type: 'Point', coordinates: [lng, lat], address: ''}
    images = models.JSONField(default=list)
    contact = models.JSONField()  # {phone, email, website}
    hours = models.CharField(max_length=200)
    price_range = models.CharField(max_length=10)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

**Message** (models.py):
```python
class Message(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

**Post** (models.py):
```python
class Post(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    images = models.JSONField(default=list)
    type = models.CharField(max_length=20, choices=[
        ('promotion', 'Promoção'),
        ('event', 'Evento'),
        ('news', 'Notícia'),
    ])
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

#### URLs necessárias (urls.py):
```python
urlpatterns = [
    path('business/register/', views.register_business),
    path('business/login/', views.login_business),
    path('business/profile/', views.business_profile),
    path('business/location/', views.update_location),
    path('business/messages/', views.list_messages),
    path('business/messages/<str:id>/read/', views.mark_as_read),
    path('business/messages/<str:id>/reply/', views.reply_message),
    path('business/posts/', views.list_posts),
    path('business/posts/<str:id>/', views.manage_post),
    path('business/posts/<str:id>/toggle/', views.toggle_post),
    path('business/stats/overview/', views.stats_overview),
    path('business/stats/views/', views.stats_views),
]
```

### 3. Integrar com App Cliente

No app cliente (frontend-vite), adicionar:

#### Exibir Posts de Negócios
- Na página Home ou Explore, mostrar posts ativos
- Filtrar por tipo (promoções, eventos)

#### Enviar Mensagens
- Adicionar botão "Enviar Mensagem" na página de detalhes do ponto
- Modal para enviar mensagem ao negócio

#### Visualizar Negócios no Mapa
- Mostrar negócios cadastrados no mapa
- Ícones diferentes por categoria

### 4. Testar Aplicação

```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Business App
cd business-app
npm run dev

# Terminal 3 - Client App
cd frontend-vite
npm run dev
```

Acessar:
- Backend: http://localhost:8000
- Business App: http://localhost:5174
- Client App: http://localhost:5173

## 🎯 Fluxo de Uso

1. **Dono de Negócio**:
   - Acessa http://localhost:5174
   - Cadastra seu negócio
   - Marca localização no mapa
   - Cria posts/promoções
   - Responde mensagens de clientes

2. **Cliente**:
   - Acessa http://localhost:5173
   - Vê posts de negócios na home
   - Vê negócios no mapa
   - Envia mensagens para negócios
   - Visualiza promoções e eventos

3. **Sincronização**:
   - Posts criados no Business App aparecem no Client App
   - Mensagens enviadas no Client App chegam no Business App
   - Localização atualizada aparece no mapa do Client App

## 📝 Notas Importantes

- Business App usa porta 5174 (diferente do client app 5173)
- Token de autenticação separado: `business_token` vs `token`
- Categorias de negócio são fixas no cadastro
- Posts podem ser ativados/desativados sem excluir
- Mensagens são marcadas como lidas automaticamente ao abrir
