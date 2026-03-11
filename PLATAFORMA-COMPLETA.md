# Plataforma Txopela Tour - Completa

## 🎯 Visão Geral

Plataforma completa para turismo com:
- **App Cliente**: Usuários exploram pontos turísticos e negócios
- **Business App**: Donos de negócios gerenciam perfis, posts e conversas
- **Backend API**: Django REST com MongoDB e SQLite

## 🚀 Funcionalidades Principais

### Para Clientes (frontend-vite)
- ✅ Explorar pontos turísticos
- ✅ Ver posts/promoções de negócios
- ✅ Enviar mensagens para negócios
- ✅ Avaliar negócios
- ✅ Buscar por categoria/localização
- ✅ Interface mobile-friendly

### Para Negócios (business-app)
- ✅ Cadastro e login de negócios
- ✅ Dashboard com estatísticas
- ✅ Mapa interativo para localização
- ✅ Sistema de mensagens com clientes
- ✅ Criação de posts com imagens
- ✅ Upload de múltiplas imagens
- ✅ Notificações em tempo real
- ✅ Analytics e métricas
- ✅ Interface mobile/desktop responsiva

### Backend (Django REST)
- ✅ API RESTful completa
- ✅ Autenticação JWT
- ✅ Upload de imagens
- ✅ Sistema de mensagens
- ✅ Notificações
- ✅ Analytics
- ✅ CORS configurado
- ✅ MongoDB + SQLite

## 📁 Estrutura do Projeto

```
txopela-tour-mvp/
├── backend/                    # Django REST API
│   ├── business_panel/         # App de negócios
│   │   ├── improved_models.py      # Modelos completos
│   │   ├── improved_serializers.py # Serializers
│   │   ├── improved_views.py       # Viewsets
│   │   └── improved_urls.py        # URLs
│   ├── pontos_turisticos/      # Pontos turísticos
│   ├── ai_service/             # IA Gemini
│   ├── authentication/         # Autenticação
│   └── MIGRATE-COMPLETE.bat    # Script de migração
├── business-app/               # App React para negócios
│   ├── src/
│   │   ├── components/mobile/  # Componentes mobile
│   │   ├── pages/mobile/       # Páginas mobile
│   │   ├── config/mobile.ts    # Config mobile
│   │   ├── services/           # Serviços API
│   │   └── context/            # Context API
│   └── SETUP.bat               # Setup do app
├── frontend-vite/              # App React para clientes
│   └── src/
│       ├── components/         # PostsCarousel, etc
│       └── services/           # API integrada
└── INICIAR-TUDO.bat            # Script para iniciar tudo
```

## 🛠️ Como Executar

### 1. Backend

```bash
cd backend
venv\Scripts\activate
MIGRATE-COMPLETE.bat
python manage.py runserver
```

### 2. Business App

```bash
cd business-app
SETUP.bat
npm run dev
```

### 3. Client App

```bash
cd frontend-vite
npm run dev
```

Ou use o script completo:

```bash
INICIAR-TUDO.bat
```

## 🔗 URLs

- **Backend API**: http://localhost:8000/api/
- **Admin Django**: http://localhost:8000/admin/
- **Business App**: http://localhost:5174/
- **Client App**: http://localhost:5173/

## 📱 Funcionalidades Mobile

### Business App Mobile
- ✅ Bottom navigation
- ✅ Swipe gestures
- ✅ Pull to refresh
- ✅ Upload de imagens
- ✅ Chat em tempo real
- ✅ Notificações push
- ✅ Offline support
- ✅ Haptic feedback

### Responsive Design
- Mobile (< 768px): Bottom nav, cards compactos
- Tablet (768px-1024px): Sidebar colapsável
- Desktop (> 1024px): Sidebar fixa, layout amplo

## 💬 Sistema de Mensagens

### Features
- ✅ Conversas entre cliente e negócio
- ✅ Envio de imagens
- ✅ Notificações de novas mensagens
- ✅ Marcar como lida
- ✅ Histórico completo
- ✅ Status online/offline

### Modelo
```
Conversation
├── business (FK)
├── user (FK)
├── last_message
├── last_message_at
├── unread_count
└── messages (1:N)
    ├── sender (FK)
    ├── content
    ├── images
    ├── read
    └── created_at
```

## 📊 Analytics

### Métricas Coletadas
- **Visualizações**: Por dia, semana, mês
- **Mensagens**: Total, não lidas, por período
- **Avaliações**: Rating médio, total
- **Posts**: Visualizações, curtidas, compartilhamentos
- **Crescimento**: Comparativo com período anterior

### Dashboard
- Cards com resumo
- Gráficos de crescimento
- Posts mais populares
- Conversas recentes

## 🖼️ Upload de Imagens

### Tipos Suportados
- **Negócio**: Logo, fotos do estabelecimento
- **Posts**: Até 10 imagens por post
- **Avaliações**: Fotos dos clientes
- **Mensagens**: Imagens no chat

### Formatos
- PNG, JPG, JPEG, GIF
- Máximo 5MB por imagem
- Redimensionamento automático

## 🔐 Segurança

### Autenticação
- JWT tokens
- Refresh tokens
- Proteção CSRF
- Rate limiting

### Permissões
- Usuários comuns: Ver posts, enviar mensagens
- Donos de negócios: Gerenciar perfil, posts, mensagens
- Administradores: Painel admin completo

## 🚀 Escalabilidade

### Backend
- ✅ UUID como primary keys
- ✅ Indexes otimizados
- ✅ Paginação
- ✅ Cache Redis (pronto para implementar)
- ✅ Background tasks (Celery)

### Frontend
- ✅ Lazy loading
- ✅ Code splitting
- ✅ Service workers
- ✅ PWA ready

## 📈 Próximos Passos

### Fase 2
- [ ] Pagamentos integrados
- [ ] Reservas online
- [ ] Agendamento de serviços
- [ ] Sistema de cupons
- [ ] Marketing automation

### Fase 3
- [ ] App nativo (React Native)
- [ ] Push notifications
- [ ] Geolocalização em tempo real
- [ ] IA para recomendações
- [ ] Analytics avançado

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro 500 no cadastro**
   ```bash
   cd backend
   python manage.py makemigrations business_panel
   python manage.py migrate
   ```

2. **CSS não carrega**
   ```bash
   cd business-app
   rmdir /s /q node_modules
   npm install
   ```

3. **CORS errors**
   Verifique `CORS_ALLOWED_ORIGINS` no `settings.py`

4. **Imagens não carregam**
   Verifique permissões do Cloudinary/S3

### Logs
- Backend: Terminal onde roda `python manage.py runserver`
- Business App: Console do browser (F12)
- Client App: Console do browser (F12)

## 📞 Suporte

### Documentação
- `PLATAFORMA-COMPLETA.md` - Este arquivo
- `SOLUCAO-RAPIDA.md` - Solução de problemas
- `DEBUG-BUSINESS-REGISTER.md` - Debug detalhado

### Testes
- `TEST-BUSINESS-FLOW.bat` - Teste automatizado
- `TEST-COMPLETE-FLOW.bat` - Teste completo

## 🎨 Design System

### Cores
- Primary: `#2563eb` (blue-600)
- Secondary: `#7c3aed` (purple-600)
- Success: `#059669` (green-600)
- Warning: `#d97706` (amber-600)
- Danger: `#dc2626` (red-600)

### Tipografia
- Font: Inter/SF Pro/system
- Sizes: 12px, 14px, 16px, 18px, 20px, 24px, 30px

### Componentes
- Cards com sombras
- Botões arredondados
- Inputs com focus rings
- Modais animados
- Loaders skeleton

## 📄 Licença

Projeto desenvolvido para Txopela Tour.

## ✨ Créditos

- Backend: Django REST Framework
- Frontend: React + TypeScript + Tailwind
- Maps: Leaflet
- Icons: Lucide React
- HTTP: Axios
- State: Context API
- Routing: React Router

---

**Status**: ✅ Produção Pronta  
**Última Atualização**: Março 2026  
**Versão**: 2.0.0  
**Autor**: Kiro AI Assistant