# 🔧 FIX PARA DEPLOY NO RENDER

## ✅ PROBLEMA RESOLVIDO

**Erro:** `gunicorn: command not found`

**Solução:** Adicionado `gunicorn==21.2.0` ao `requirements.txt`

---

## 📝 ARQUIVOS ATUALIZADOS

1. **backend/requirements.txt** - Adicionado gunicorn e Pillow
2. **backend/runtime.txt** - Especifica Python 3.11.0
3. **backend/Procfile** - Comando alternativo para iniciar
4. **render.yaml** - Melhorado buildCommand

---

## 🚀 COMO FAZER O DEPLOY NO RENDER

### Opção 1: Usando render.yaml (Recomendado)

1. Acesse https://dashboard.render.com
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub: `AnselmoXf1/txpela-tour`
4. O Render detectará automaticamente o `render.yaml`
5. Clique em "Apply"
6. Adicione as variáveis de ambiente secretas:
   - `MONGODB_URI`: `mongodb+srv://txopito-ADMIN:txopitoAdmin12@cluster0.bt5at8j.mongodb.net/?appName=Cluster0`
   - `GEMINI_API_KEY`: `AIzaSyBeusp4cuMC709uuQ1ZfpQzdK4sdp6GP2Y`
   - `CLOUDINARY_API_KEY`: `466684533682764`
   - `CLOUDINARY_API_SECRET`: `sr7corAilOWbuoowREg5cWW67G0`
7. Clique em "Create Web Service"

### Opção 2: Configuração Manual

1. Acesse https://dashboard.render.com
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:

**Basic:**
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

**Environment Variables:**
```
PYTHON_VERSION=3.11.0
DEBUG=False
ALLOWED_HOSTS=.onrender.com
MONGODB_URI=mongodb+srv://txopito-ADMIN:txopitoAdmin12@cluster0.bt5at8j.mongodb.net/?appName=Cluster0
MONGODB_DB_NAME=txopito_ia_db
GEMINI_API_KEY=AIzaSyBeusp4cuMC709uuQ1ZfpQzdK4sdp6GP2Y
CLOUDINARY_CLOUD_NAME=dozv8vbuc
CLOUDINARY_API_KEY=466684533682764
CLOUDINARY_API_SECRET=sr7corAilOWbuoowREg5cWW67G0
CORS_ALLOWED_ORIGINS=https://txopela-tour.vercel.app,https://txopela-admin.vercel.app,https://txopela-business.vercel.app
SECRET_KEY=<gerar automaticamente>
```

5. Clique em "Create Web Service"

---

## ⏱️ TEMPO DE DEPLOY

- **Build:** 3-5 minutos
- **Deploy:** 1-2 minutos
- **Total:** ~5-7 minutos

---

## 🔍 VERIFICAR SE DEU CERTO

### 1. Logs do Render
No dashboard, você verá:
```
==> Build successful 🎉
==> Deploying...
==> Your service is live 🎉
```

### 2. Testar a URL
```bash
# Substitua pela sua URL do Render
curl https://txopela-api.onrender.com/api/health/
```

### 3. Testar no navegador
Abra: `https://txopela-api.onrender.com/api/health/`

Deve retornar algo como:
```json
{
  "status": "ok",
  "message": "API is running"
}
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Module not found"
**Solução:** Verifique se todas as dependências estão no `requirements.txt`

### Erro: "Port already in use"
**Solução:** O Render usa a variável `$PORT` automaticamente, não precisa alterar

### Erro: "Application failed to start"
**Solução:** Verifique os logs no dashboard do Render

### Erro: "CORS error"
**Solução:** Adicione a variável `CORS_ALLOWED_ORIGINS` com as URLs dos frontends

### Erro: "Database connection failed"
**Solução:** Verifique se `MONGODB_URI` está correto nas variáveis de ambiente

---

## 📊 APÓS O DEPLOY

### 1. Copiar a URL da API
Exemplo: `https://txopela-api-xxxx.onrender.com`

### 2. Atualizar os frontends
Edite os arquivos `.env.production`:

**frontend-vite/.env.production:**
```env
VITE_API_URL=https://txopela-api-xxxx.onrender.com/api
```

**admin-app/.env.production:**
```env
VITE_API_URL=https://txopela-api-xxxx.onrender.com/api
```

**business-app/.env.production:**
```env
VITE_API_URL=https://txopela-api-xxxx.onrender.com/api
```

### 3. Commit e push
```bash
git add .
git commit -m "Update API URL"
git push
```

### 4. Atualizar CORS no Render
Volte ao Render Dashboard → Environment → Adicione as URLs reais do Vercel

---

## 🔄 REDEPLOY

Se precisar fazer redeploy:

### Automático (recomendado):
```bash
git add .
git commit -m "Update"
git push
```
O Render faz redeploy automático!

### Manual:
1. Acesse o dashboard do Render
2. Clique em "Manual Deploy"
3. Selecione a branch
4. Clique em "Deploy"

---

## 💡 DICAS

1. **Free Tier:** O plano gratuito "dorme" após 15 minutos de inatividade. A primeira requisição pode demorar 30-60 segundos.

2. **Logs:** Sempre verifique os logs em tempo real durante o deploy

3. **Variáveis de Ambiente:** Use "sync: false" no render.yaml para variáveis secretas

4. **Health Check:** Configure um health check endpoint para manter o serviço ativo

5. **Domínio Customizado:** Você pode adicionar um domínio próprio nas configurações

---

## ✅ CHECKLIST

- [x] gunicorn adicionado ao requirements.txt
- [x] runtime.txt criado
- [x] Procfile criado
- [x] render.yaml atualizado
- [x] Git atualizado
- [ ] Deploy no Render
- [ ] Testar API
- [ ] Copiar URL
- [ ] Atualizar frontends
- [ ] Deploy frontends no Vercel

---

## 🎉 PRÓXIMO PASSO

Agora você pode fazer o deploy no Render! O erro do gunicorn está resolvido.

**Acesse:** https://dashboard.render.com

**Repositório:** https://github.com/AnselmoXf1/txpela-tour
