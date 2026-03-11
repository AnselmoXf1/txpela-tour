# 🏝️ Txopela Tour MVP

Plataforma de turismo para Inhambane, Moçambique, com painel administrativo e aplicação cliente.

## 📁 Estrutura do Projeto

```
txopela-tour-mvp/
├── backend/          # Django + MongoDB + Cloudinary
├── admin-app/        # React Admin Panel (Vite)
├── frontend-vite/    # React Client App (Vite)
└── docs/            # Documentação
```

## 🚀 Quick Start

### 1. Setup Inicial (Primeira vez)
```bash
SETUP-TUDO.bat
```

### 2. Iniciar Tudo
```bash
START-ALL.bat
```

Ou iniciar individualmente:

**Backend:**
```bash
cd backend
python manage.py runserver
```

**Admin App:**
```bash
cd admin-app
npm run dev
# http://localhost:5173
```

**Client App:**
```bash
cd frontend-vite
npm run dev
# http://localhost:5174
```

## 🏗️ Arquitetura

### Backend (Django)
- **Framework:** Django REST Framework
- **Banco de Dados:** MongoDB Atlas
- **Armazenamento de Imagens:** Cloudinary
- **Autenticação:** JWT
- **IA:** Google Gemini API

### Admin App (React)
- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Estilo:** Tailwind CSS
- **Funcionalidades:**
  - ✅ CRUD completo de pontos turísticos
  - ✅ Upload múltiplo de imagens
  - ✅ Edição de fotos (drag & drop, reordenar, deletar)
  - ✅ Dashboard com estatísticas
  - ✅ Autenticação JWT

### Client App (React)
- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Estilo:** Tailwind CSS
- **Funcionalidades:**
  - ✅ Feed estilo Instagram
  - ✅ Exploração com mapa interativo
  - ✅ Detalhes completos dos pontos
  - ✅ Sistema de avaliações
  - ✅ Chat com IA (Gemini)

## 🔧 Configuração

### Backend (.env)
```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=txopito_ia_db

# Cloudinary
CLOUDINARY_CLOUD_NAME=dozv8vbuc
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Google Gemini AI
GEMINI_API_KEY=...

# Django
SECRET_KEY=...
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### Admin App (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

### Client App (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

## 📊 Fluxo de Dados

```
ADMIN APP (Criar/Editar/Deletar)
    ↓
BACKEND (Django + MongoDB + Cloudinary)
    ↓
CLIENT APP (Visualizar/Avaliar)
```

### Operações CRUD

**CREATE:**
- Admin cria ponto com fotos
- Fotos → Cloudinary
- Dados → MongoDB
- Client vê novo ponto no feed

**READ:**
- Client busca pontos via API
- Exibe fotos do Cloudinary
- Mostra dados do MongoDB

**UPDATE:**
- Admin edita dados ou fotos
- Atualiza MongoDB/Cloudinary
- Client vê mudanças após reload

**DELETE:**
- Admin deleta ponto
- Remove de MongoDB e Cloudinary
- Client não mostra mais o ponto

## 🧪 Testes

### Testar CRUD Admin
```bash
TEST-ADMIN-CRUD.bat
```

### Testar Integração Admin ↔ Client
```bash
TEST-INTEGRATION.bat
```

### Teste Manual
1. **Admin:** Criar ponto com 3 fotos
2. **Client:** Verificar no feed (Home)
3. **Client:** Verificar no mapa (Explore)
4. **Client:** Abrir detalhes e ver galeria
5. **Admin:** Editar dados e fotos
6. **Client:** Recarregar e verificar mudanças
7. **Admin:** Deletar ponto
8. **Client:** Verificar que sumiu

## 📚 Documentação

- **[CRUD-ADMIN-STATUS.md](CRUD-ADMIN-STATUS.md)** - Status completo do CRUD
- **[INTEGRACAO-ADMIN-CLIENT.md](INTEGRACAO-ADMIN-CLIENT.md)** - Como admin e client se integram
- **[backend/README.md](backend/README.md)** - Documentação do backend
- **[backend/SEED-DATABASE.md](backend/SEED-DATABASE.md)** - Como popular o banco

## 🛠️ Scripts Úteis

### Gerais
- `START-ALL.bat` - Inicia backend, admin e client
- `SETUP-TUDO.bat` - Setup completo do projeto
- `CLEANUP-PROJECT.bat` - Limpa arquivos temporários

### Backend
- `backend/start-backend.bat` - Inicia Django
- `backend/seed-database.bat` - Popula banco com dados
- `backend/create-admin.bat` - Cria usuário admin

### Testes
- `TEST-ADMIN-CRUD.bat` - Testa CRUD do admin
- `TEST-INTEGRATION.bat` - Testa integração completa

## 🔐 Credenciais Padrão

**Admin:**
- Username: `admin`
- Password: `admin123`

(Criar com `backend/create-admin.bat`)

## 📦 Dependências

### Backend
- Python 3.8+
- Django 4.2+
- djangorestframework
- pymongo
- cloudinary
- google-generativeai

### Frontend (Admin + Client)
- Node.js 18+
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Leaflet (mapas)

## 🌐 URLs

- **Backend API:** http://localhost:8000/api
- **Admin Panel:** http://localhost:5173
- **Client App:** http://localhost:5174
- **Django Admin:** http://localhost:8000/admin

## 🐛 Troubleshooting

### Backend não inicia
```bash
cd backend
python -m pip install -r requirements.txt
python manage.py check
```

### MongoDB não conecta
- Verificar MONGODB_URI no .env
- Testar conexão: `python -c "from pontos_turisticos.mongodb import mongodb; print(mongodb.db.name)"`

### Cloudinary não funciona
- Verificar credenciais no .env
- Testar: `python -c "import cloudinary; print('OK')"`

### Client não mostra pontos
- Verificar se backend está rodando
- Verificar VITE_API_URL no .env
- Abrir console do browser (F12) e ver erros

### Imagens não aparecem
- Verificar se foram enviadas para Cloudinary
- Ver URLs no MongoDB
- Verificar CORS no backend

## 📝 Notas

- Dados armazenados em **MongoDB Atlas** (cloud)
- Imagens armazenadas em **Cloudinary** (cloud)
- Autenticação via **JWT tokens**
- IA usa **Google Gemini API**

## 🚧 Próximos Passos

- [ ] Deploy em produção
- [ ] Otimização de imagens
- [ ] Cache de dados
- [ ] Notificações em tempo real
- [ ] App mobile (React Native)

## 📄 Licença

MIT

## 👥 Equipe

Desenvolvido para promover o turismo em Inhambane, Moçambique 🇲🇿
