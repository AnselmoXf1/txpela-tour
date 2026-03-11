# 📋 Comandos Corretos - Txopela Tour

## ⚠️ IMPORTANTE: Backend é Python, não Node.js!

### ❌ ERRADO
```bash
cd backend
npm run dev  # ERRO! Backend não usa npm
```

### ✅ CORRETO

## 🚀 Iniciar Tudo (Recomendado)

```bash
START-ALL.bat
```

Isso abre 3 terminais automaticamente:
- Backend (Python/Django)
- Admin App (React/Vite)
- Client App (React/Vite)

## 🔧 Iniciar Individualmente

### Backend (Python/Django)
```bash
cd backend
start-backend.bat
```

Ou manualmente:
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

### Admin App (React/Vite)
```bash
cd admin-app
npm run dev
```

### Client App (React/Vite)
```bash
cd frontend-vite
npm run dev
```

## 📦 Instalação de Dependências

### Backend (Python)
```bash
cd backend
install-dependencies.bat
```

Ou manualmente:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Admin App (Node.js)
```bash
cd admin-app
npm install
```

### Client App (Node.js)
```bash
cd frontend-vite
npm install
```

## 🗄️ Banco de Dados

### Popular com dados de exemplo
```bash
cd backend
seed-database.bat
```

Ou manualmente:
```bash
cd backend
venv\Scripts\activate
python seed_pontos.py
```

### Criar usuário admin
```bash
cd backend
create-admin.bat
```

Ou manualmente:
```bash
cd backend
venv\Scripts\activate
python create_admin.py
```

## 🧪 Testes

### Testar CRUD Admin
```bash
TEST-ADMIN-CRUD.bat
```

### Testar Integração
```bash
TEST-INTEGRATION.bat
```

## 🧹 Limpeza

### Limpar arquivos temporários
```bash
CLEANUP-PROJECT.bat
```

## 📊 Estrutura de Comandos

```
Backend (Python/Django)
├── python manage.py runserver    # Iniciar servidor
├── python manage.py check         # Verificar erros
├── python manage.py migrate       # Migrar banco
├── python seed_pontos.py          # Popular dados
└── python create_admin.py         # Criar admin

Admin App (Node.js/React)
├── npm install                    # Instalar deps
├── npm run dev                    # Modo desenvolvimento
└── npm run build                  # Build produção

Client App (Node.js/React)
├── npm install                    # Instalar deps
├── npm run dev                    # Modo desenvolvimento
└── npm run build                  # Build produção
```

## 🌐 URLs Padrão

- **Backend API:** http://localhost:8000/api
- **Django Admin:** http://localhost:8000/admin
- **Admin App:** http://localhost:5173
- **Client App:** http://localhost:5174

## 🔑 Credenciais Padrão

**Django Admin / Admin App:**
- Username: `admin`
- Password: `admin123`

## 💡 Dicas

### Verificar se backend está rodando
```bash
curl http://localhost:8000/api/pontos-turisticos/
```

### Verificar Python
```bash
python --version
# Deve ser 3.8 ou superior
```

### Verificar Node.js
```bash
node --version
# Deve ser 18 ou superior
```

### Ativar ambiente virtual Python
```bash
cd backend
venv\Scripts\activate
# Você verá (venv) no prompt
```

### Desativar ambiente virtual
```bash
deactivate
```

## 🐛 Troubleshooting

### "npm run dev" no backend não funciona
**Problema:** Backend é Python, não Node.js
**Solução:** Use `python manage.py runserver`

### "python não é reconhecido"
**Problema:** Python não instalado ou não no PATH
**Solução:** Instale Python 3.8+ de python.org

### "npm não é reconhecido"
**Problema:** Node.js não instalado
**Solução:** Instale Node.js 18+ de nodejs.org

### Backend não inicia
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
python manage.py check
```

### Admin/Client não inicia
```bash
cd admin-app  # ou frontend-vite
npm install
npm run dev
```

### Porta já em uso
```bash
# Backend (8000)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Admin (5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Client (5174)
netstat -ano | findstr :5174
taskkill /PID <PID> /F
```

## 📝 Resumo Rápido

```bash
# Setup inicial (1 vez)
SETUP-TUDO.bat

# Iniciar desenvolvimento
START-ALL.bat

# Ou manualmente:
# Terminal 1
cd backend
start-backend.bat

# Terminal 2
cd admin-app
npm run dev

# Terminal 3
cd frontend-vite
npm run dev
```

## ✅ Checklist

Antes de começar, verifique:
- [ ] Python 3.8+ instalado
- [ ] Node.js 18+ instalado
- [ ] Git instalado (opcional)
- [ ] Variáveis de ambiente configuradas (.env)
- [ ] MongoDB Atlas acessível
- [ ] Cloudinary configurado

Pronto para desenvolver! 🚀
