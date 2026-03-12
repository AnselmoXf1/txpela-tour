# 🚀 DEPLOY RÁPIDO - 4 URLs DIFERENTES

## ✅ O QUE FOI FEITO

1. ✅ Corrigido erro no `PointAnalytics.tsx`
2. ✅ Criados arquivos de configuração para deploy
3. ✅ Atualizado Git e enviado para GitHub
4. ✅ Preparado para deploy em 4 URLs diferentes

---

## 📍 ARQUITETURA

```
┌─────────────────────────────────────────┐
│  1. API Backend → Render.com           │
│     https://txopela-api.onrender.com    │
└─────────────────────────────────────────┘
           ↓ ↓ ↓
┌─────────────────────────────────────────┐
│  2. Frontend Cliente → Vercel           │
│     https://txopela-tour.vercel.app     │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  3. Admin App → Vercel                  │
│     https://txopela-admin.vercel.app    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  4. Business App → Vercel               │
│     https://txopela-business.vercel.app │
└─────────────────────────────────────────┘
```

---

## 🎯 PASSO A PASSO

### 1️⃣ DEPLOY DO BACKEND NO RENDER

1. Acesse: https://render.com
2. Faça login com GitHub
3. Clique em "New +" → "Web Service"
4. Conecte o repositório: `AnselmoXf1/txpela-tour`
5. Configure:
   - **Name:** `txopela-api`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn txopela_backend.wsgi:application --bind 0.0.0.0:$PORT`
6. Adicione as variáveis de ambiente:
   ```
   SECRET_KEY=<gerar automaticamente>
   DEBUG=False
   ALLOWED_HOSTS=.onrender.com
   MONGODB_URI=mongodb+srv://txopito-ADMIN:txopitoAdmin12@cluster0.bt5at8j.mongodb.net/?appName=Cluster0
   MONGODB_DB_NAME=txopito_ia_db
   GEMINI_API_KEY=AIzaSyBeusp4cuMC709uuQ1ZfpQzdK4sdp6GP2Y
   CLOUDINARY_CLOUD_NAME=dozv8vbuc
   CLOUDINARY_API_KEY=466684533682764
   CLOUDINARY_API_SECRET=sr7corAilOWbuoowREg5cWW67G0
   ```
7. Clique em "Create Web Service"
8. Aguarde o deploy (5-10 minutos)
9. Copie a URL gerada (ex: `https://txopela-api.onrender.com`)

### 2️⃣ ATUALIZAR URLs NOS FRONTENDS

Depois de ter a URL do Render, atualize os arquivos `.env.production`:

```bash
# frontend-vite/.env.production
VITE_API_URL=https://txopela-api.onrender.com/api

# admin-app/.env.production
VITE_API_URL=https://txopela-api.onrender.com/api

# business-app/.env.production
VITE_API_URL=https://txopela-api.onrender.com/api
```

Commit e push:
```bash
git add .
git commit -m "Update API URL"
git push
```

### 3️⃣ DEPLOY DOS FRONTENDS NO VERCEL

#### Instalar Vercel CLI:
```bash
npm install -g vercel
vercel login
```

#### Deploy Frontend Cliente:
```bash
cd frontend-vite
vercel --prod
```

#### Deploy Admin App:
```bash
cd ../admin-app
vercel --prod
```

#### Deploy Business App:
```bash
cd ../business-app
vercel --prod
```

### 4️⃣ ATUALIZAR CORS NO BACKEND

Depois de ter todas as URLs do Vercel, atualize o backend:

1. Acesse o Render Dashboard
2. Vá em "Environment"
3. Adicione/atualize:
   ```
   CORS_ALLOWED_ORIGINS=https://txopela-tour.vercel.app,https://txopela-admin.vercel.app,https://txopela-business.vercel.app
   ```
4. Salve e aguarde o redeploy automático

---

## 🧪 TESTAR A API

### Localmente:
```bash
python test_api_render.py
```

### No navegador:
```
https://txopela-api.onrender.com/api/health/
```

### Com curl:
```bash
curl https://txopela-api.onrender.com/api/ai/chat/ \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"content": "Olá"}]}'
```

---

## 📊 MONITORAMENTO

### Render (Backend):
- Dashboard: https://dashboard.render.com
- Logs em tempo real
- Métricas de uso

### Vercel (Frontends):
- Dashboard: https://vercel.com/dashboard
- Analytics
- Logs de deploy

---

## 💰 CUSTOS

| Serviço | Plano | Custo |
|---------|-------|-------|
| Render | Free | R$ 0 |
| Vercel (3 apps) | Hobby | R$ 0 |
| **TOTAL** | | **R$ 0/mês** |

**Limites do plano gratuito:**
- Render: 750h/mês (suficiente para 1 app 24/7)
- Vercel: 100GB bandwidth/mês por projeto

---

## 🔧 COMANDOS ÚTEIS

### Ver logs do Render:
```bash
# No dashboard do Render, clique em "Logs"
```

### Ver logs do Vercel:
```bash
vercel logs [deployment-url]
```

### Forçar redeploy:
```bash
# Render: No dashboard, clique em "Manual Deploy"
# Vercel: 
vercel --prod --force
```

### Rollback:
```bash
# Vercel permite rollback no dashboard
# Render: Redeploy de um commit anterior
```

---

## ⚠️ TROUBLESHOOTING

### Backend não inicia:
- Verifique logs no Render Dashboard
- Verifique variáveis de ambiente
- Teste localmente primeiro

### Frontend não conecta:
- Verifique VITE_API_URL
- Verifique CORS no backend
- Abra console do navegador (F12)

### Build falha:
- Limpe cache: `vercel --force`
- Verifique node_modules
- Teste build local: `npm run build`

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **Deploy detalhado:** `DEPLOY-SEPARADO.md`
- **Deploy VPS:** `DEPLOY-VPS.md`
- **Configurações:** `vps_env_config.txt`

---

## ✅ CHECKLIST

- [ ] Backend deployado no Render
- [ ] URL do backend copiada
- [ ] .env.production atualizado nos 3 frontends
- [ ] Frontend Cliente deployado no Vercel
- [ ] Admin App deployado no Vercel
- [ ] Business App deployado no Vercel
- [ ] CORS atualizado no backend
- [ ] Testado todas as URLs
- [ ] Monitoramento configurado

---

## 🎉 PRONTO!

Seu projeto está no ar em 4 URLs diferentes, totalmente grátis!

**Próximos passos:**
1. Configurar domínio customizado (opcional)
2. Adicionar SSL/HTTPS (automático no Vercel e Render)
3. Configurar CI/CD (já automático com Git push)
4. Monitorar performance e erros
