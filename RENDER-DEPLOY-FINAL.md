# 🚀 DEPLOY FINAL NO RENDER - TODAS AS CORREÇÕES

## ✅ PROBLEMAS RESOLVIDOS

1. ✅ **gunicorn não encontrado** → Adicionado ao requirements.txt
2. ✅ **Pillow incompatível com Python 3.14** → Forçado Python 3.11.9
3. ✅ **Versão do Pillow** → Mudado para `>=10.0.0` (flexível)

---

## 📝 ARQUIVOS FINAIS

### backend/requirements.txt
```txt
Django==5.0.3
djangorestframework==3.15.1
pymongo==4.6.2
python-dotenv==1.0.1
djangorestframework-simplejwt==5.3.1
django-cors-headers==4.3.1
google-generativeai==0.4.1
cloudinary==1.40.0
gunicorn==21.2.0
Pillow>=10.0.0
```

### backend/runtime.txt
```txt
python-3.11.9
```

### backend/Procfile
```txt
web: gunicorn txopela_backend.wsgi:application --bind 0.0.0.0:$PORT
```

---

## 🎯 DEPLOY NO RENDER - PASSO A PASSO

### 1️⃣ Acesse o Render
https://dashboard.render.com

### 2️⃣ Crie um novo Web Service
- Clique em "New +" → "Web Service"
- Conecte o GitHub
- Selecione: `AnselmoXf1/txpela-tour`

### 3️⃣ Configure o Serviço

**Basic Settings:**
- **Name:** `txopela-api`
- **Region:** Oregon (US West)
- **Branch:** `master`
- **Root Directory:** `backend`
- **Runtime:** Python 3

**Build & Deploy:**
- **Build Command:**
  ```bash
  pip install --upgrade pip && pip install -r requirements.txt
  ```
- **Start Command:**
  ```bash
  gunicorn txopela_backend.wsgi:application --bind 0.0.0.0:$PORT
  ```

### 4️⃣ Adicione as Variáveis de Ambiente

Clique em "Advanced" → "Add Environment Variable":

```
PYTHON_VERSION=3.11.9
DEBUG=False
ALLOWED_HOSTS=.onrender.com
MONGODB_URI=mongodb+srv://txopito-ADMIN:txopitoAdmin12@cluster0.bt5at8j.mongodb.net/?appName=Cluster0
MONGODB_DB_NAME=txopito_ia_db
GEMINI_API_KEY=AIzaSyBeusp4cuMC709uuQ1ZfpQzdK4sdp6GP2Y
CLOUDINARY_CLOUD_NAME=dozv8vbuc
CLOUDINARY_API_KEY=466684533682764
CLOUDINARY_API_SECRET=sr7corAilOWbuoowREg5cWW67G0
CORS_ALLOWED_ORIGINS=https://txopela-tour.vercel.app,https://txopela-admin.vercel.app,https://txopela-business.vercel.app
```

**Para SECRET_KEY:**
- Clique em "Generate" para criar automaticamente

### 5️⃣ Crie o Web Service
- Clique em "Create Web Service"
- Aguarde o deploy (5-7 minutos)

---

## 🔍 VERIFICAR O DEPLOY

### Durante o Deploy
Você verá no log:
```
==> Downloading Python 3.11.9
==> Installing dependencies
==> Collecting Django==5.0.3
==> Collecting gunicorn==21.2.0
==> Collecting Pillow>=10.0.0
==> Build successful 🎉
==> Deploying...
==> Your service is live 🎉
```

### Após o Deploy
1. Copie a URL gerada (ex: `https://txopela-api-xxxx.onrender.com`)
2. Teste no navegador: `https://txopela-api-xxxx.onrender.com/api/health/`

---

## 🧪 TESTAR A API

### 1. Health Check
```bash
curl https://txopela-api-xxxx.onrender.com/api/health/
```

### 2. Chat AI
```bash
curl -X POST https://txopela-api-xxxx.onrender.com/api/ai/chat/ \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"content": "Olá"}]}'
```

### 3. Pontos Turísticos
```bash
curl https://txopela-api-xxxx.onrender.com/api/pontos/
```

### 4. Script Python
```bash
python test_api_render.py
```

---

## 📊 APÓS O DEPLOY BEM-SUCEDIDO

### 1️⃣ Copie a URL da API
Exemplo: `https://txopela-api-abc123.onrender.com`

### 2️⃣ Atualize os Frontends

**frontend-vite/.env.production:**
```env
VITE_API_URL=https://txopela-api-abc123.onrender.com/api
VITE_APP_NAME=Txopela Tour
VITE_APP_VERSION=1.0.0
```

**admin-app/.env.production:**
```env
VITE_API_URL=https://txopela-api-abc123.onrender.com/api
VITE_APP_NAME=Txopela Admin
VITE_APP_VERSION=1.0.0
```

**business-app/.env.production:**
```env
VITE_API_URL=https://txopela-api-abc123.onrender.com/api
VITE_APP_NAME=Txopela Business
VITE_APP_VERSION=1.0.0
```

### 3️⃣ Commit e Push
```bash
git add .
git commit -m "Update API URL with Render deployment"
git push
```

### 4️⃣ Deploy dos Frontends no Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy Frontend Cliente
cd frontend-vite
vercel --prod

# Deploy Admin App
cd ../admin-app
vercel --prod

# Deploy Business App
cd ../business-app
vercel --prod
```

---

## 🔄 ATUALIZAR CORS NO RENDER

Depois de ter as URLs do Vercel, atualize no Render:

1. Acesse o Render Dashboard
2. Vá em "Environment"
3. Edite `CORS_ALLOWED_ORIGINS`:
   ```
   https://txopela-tour-xxx.vercel.app,https://txopela-admin-xxx.vercel.app,https://txopela-business-xxx.vercel.app
   ```
4. Salve (redeploy automático)

---

## ⚠️ IMPORTANTE - PLANO GRATUITO

### Limitações:
- **Sleep após 15 min de inatividade**
- **Primeira requisição pode demorar 30-60s** (cold start)
- **750 horas/mês** (suficiente para 1 app 24/7)

### Solução para Cold Start:
Configure um serviço de ping (opcional):
- UptimeRobot: https://uptimerobot.com
- Cron-job.org: https://cron-job.org

Ping a cada 10 minutos: `https://sua-api.onrender.com/api/health/`

---

## 🐛 TROUBLESHOOTING

### Build falha com erro de Python
**Solução:** Verifique se `PYTHON_VERSION=3.11.9` está nas variáveis de ambiente

### Erro "Module not found"
**Solução:** Verifique se o módulo está no `requirements.txt`

### Erro de CORS
**Solução:** Adicione as URLs dos frontends em `CORS_ALLOWED_ORIGINS`

### Erro de conexão com MongoDB
**Solução:** Verifique se `MONGODB_URI` está correto

### App não inicia
**Solução:** Verifique os logs no dashboard do Render

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- **Render Docs:** https://render.com/docs
- **Django Deploy:** https://docs.djangoproject.com/en/5.0/howto/deployment/
- **Gunicorn:** https://docs.gunicorn.org/

---

## ✅ CHECKLIST FINAL

- [x] Python 3.11.9 configurado
- [x] gunicorn no requirements.txt
- [x] Pillow compatível
- [x] runtime.txt criado
- [x] Procfile criado
- [x] render.yaml atualizado
- [x] Git atualizado
- [ ] Deploy no Render
- [ ] API testada e funcionando
- [ ] URL da API copiada
- [ ] Frontends atualizados
- [ ] Frontends deployados no Vercel
- [ ] CORS atualizado
- [ ] Tudo testado e funcionando

---

## 🎉 RESULTADO ESPERADO

Após seguir todos os passos, você terá:

1. ✅ **API Backend** rodando no Render
2. ✅ **Frontend Cliente** no Vercel
3. ✅ **Admin App** no Vercel
4. ✅ **Business App** no Vercel
5. ✅ **Tudo conectado e funcionando**
6. ✅ **100% gratuito**

---

## 🚀 PRÓXIMO PASSO

**Agora você pode fazer o deploy no Render!**

Todos os erros foram corrigidos:
- ✅ gunicorn instalado
- ✅ Python 3.11.9 forçado
- ✅ Pillow compatível

**Acesse:** https://dashboard.render.com

**Boa sorte! 🎉**
