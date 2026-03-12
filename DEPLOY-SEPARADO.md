# DEPLOY EM 4 URLs DIFERENTES - TXOPELA TOUR

## ARQUITETURA DE DEPLOY

```
1. API Backend → Render.com
2. Frontend Cliente → Vercel/Netlify
3. Admin App → Vercel/Netlify
4. Business App → Vercel/Netlify
```

---

## 1. BACKEND API NO RENDER

### 1.1. Preparar Backend para Render

Criar arquivo `render.yaml` na raiz do projeto:

```yaml
services:
  - type: web
    name: txopela-api
    env: python
    region: oregon
    plan: free
    buildCommand: cd backend && pip install -r requirements.txt
    startCommand: cd backend && gunicorn txopela_backend.wsgi:application --bind 0.0.0.0:$PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: SECRET_KEY
        generateValue: true
      - key: DEBUG
        value: False
      - key: ALLOWED_HOSTS
        value: .onrender.com
      - key: MONGODB_URI
        value: mongodb+srv://txopito-ADMIN:txopitoAdmin12@cluster0.bt5at8j.mongodb.net/?appName=Cluster0
      - key: MONGODB_DB_NAME
        value: txopito_ia_db
      - key: GEMINI_API_KEY
        value: AIzaSyBeusp4cuMC709uuQ1ZfpQzdK4sdp6GP2Y
      - key: CLOUDINARY_CLOUD_NAME
        value: dozv8vbuc
      - key: CLOUDINARY_API_KEY
        value: 466684533682764
      - key: CLOUDINARY_API_SECRET
        value: sr7corAilOWbuoowREg5cWW67G0
```

### 1.2. Criar requirements.txt no backend

```txt
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
gunicorn==21.2.0
pymongo==4.6.0
google-generativeai==0.3.1
cloudinary==1.36.0
python-dotenv==1.0.0
Pillow==10.1.0
```

### 1.3. Deploy no Render

1. Acesse https://render.com
2. Conecte seu repositório GitHub
3. Crie novo Web Service
4. Configure:
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && gunicorn txopela_backend.wsgi:application --bind 0.0.0.0:$PORT`
5. Adicione variáveis de ambiente
6. Deploy!

**URL da API:** `https://txopela-api.onrender.com`

---

## 2. FRONTEND CLIENTE NO VERCEL

### 2.1. Configurar frontend-vite/.env.production

```env
VITE_API_URL=https://txopela-api.onrender.com/api
VITE_APP_NAME=Txopela Tour
```

### 2.2. Criar vercel.json no frontend-vite

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2.3. Deploy no Vercel

```bash
cd frontend-vite
npm install -g vercel
vercel login
vercel --prod
```

**URL:** `https://txopela-tour.vercel.app`

---

## 3. ADMIN APP NO VERCEL

### 3.1. Configurar admin-app/.env.production

```env
VITE_API_URL=https://txopela-api.onrender.com/api
VITE_APP_NAME=Txopela Admin
```

### 3.2. Criar vercel.json no admin-app

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3.3. Deploy no Vercel

```bash
cd admin-app
vercel --prod
```

**URL:** `https://txopela-admin.vercel.app`

---

## 4. BUSINESS APP NO VERCEL

### 4.1. Configurar business-app/.env.production

```env
VITE_API_URL=https://txopela-api.onrender.com/api
VITE_APP_NAME=Txopela Business
```

### 4.2. Criar vercel.json no business-app

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 4.3. Deploy no Vercel

```bash
cd business-app
vercel --prod
```

**URL:** `https://txopela-business.vercel.app`

---

## ALTERNATIVA: NETLIFY

Se preferir usar Netlify em vez de Vercel:

### Criar netlify.toml em cada app

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Deploy no Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## CONFIGURAÇÃO DO BACKEND PARA CORS

Atualizar `backend/txopela_backend/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "https://txopela-tour.vercel.app",
    "https://txopela-admin.vercel.app",
    "https://txopela-business.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
]

ALLOWED_HOSTS = [
    'txopela-api.onrender.com',
    'localhost',
    '127.0.0.1',
]

CSRF_TRUSTED_ORIGINS = [
    "https://txopela-api.onrender.com",
    "https://txopela-tour.vercel.app",
    "https://txopela-admin.vercel.app",
    "https://txopela-business.vercel.app",
]
```

---

## RESUMO DAS URLs

| Aplicação | Plataforma | URL |
|-----------|-----------|-----|
| API Backend | Render | https://txopela-api.onrender.com |
| Frontend Cliente | Vercel | https://txopela-tour.vercel.app |
| Admin App | Vercel | https://txopela-admin.vercel.app |
| Business App | Vercel | https://txopela-business.vercel.app |

---

## SCRIPT DE DEPLOY AUTOMATIZADO

Criar `deploy-all.sh`:

```bash
#!/bin/bash

echo "=== DEPLOY TXOPELA TOUR ==="

# 1. Deploy Backend no Render
echo "1. Backend será deployado via Render Dashboard"
echo "   Acesse: https://dashboard.render.com"

# 2. Deploy Frontend Cliente
echo "2. Deployando Frontend Cliente..."
cd frontend-vite
vercel --prod
cd ..

# 3. Deploy Admin App
echo "3. Deployando Admin App..."
cd admin-app
vercel --prod
cd ..

# 4. Deploy Business App
echo "4. Deployando Business App..."
cd business-app
vercel --prod
cd ..

echo "=== DEPLOY CONCLUÍDO ==="
```

---

## MONITORAMENTO

### Logs do Backend (Render)
- Acesse: https://dashboard.render.com
- Selecione seu serviço
- Veja logs em tempo real

### Logs dos Frontends (Vercel)
```bash
vercel logs [deployment-url]
```

---

## ATUALIZAÇÃO RÁPIDA

Para atualizar qualquer app:

```bash
# Commit e push
git add .
git commit -m "Update"
git push

# Vercel faz deploy automático
# Render faz deploy automático
```

---

## CUSTOS

- **Render (Backend):** Grátis (750h/mês)
- **Vercel (3 Frontends):** Grátis (100GB bandwidth/mês)
- **Total:** R$ 0,00/mês

---

## TROUBLESHOOTING

### Backend não inicia no Render
```bash
# Verificar logs no dashboard
# Verificar variáveis de ambiente
# Verificar requirements.txt
```

### Frontend não conecta com API
```bash
# Verificar VITE_API_URL no .env.production
# Verificar CORS no backend
# Verificar console do navegador
```

### Build falha
```bash
# Verificar node_modules
# Limpar cache: vercel --force
# Verificar package.json
```