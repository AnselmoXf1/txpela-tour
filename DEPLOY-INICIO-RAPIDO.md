# 🚀 Deploy Rápido - Guia de Início

## ⚡ Opção 1: Deploy Automático (Recomendado)

### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Passo 2: Fazer Login

```bash
vercel login
```

### Passo 3: Deploy Tudo

Execute o script:

```bash
DEPLOY-ALL-VERCEL.bat
```

Ou manualmente:

```bash
# Frontend
cd frontend-vite
vercel --prod

# Admin
cd ../admin-app
vercel --prod

# Business
cd ../business-app
vercel --prod
```

---

## 🌐 Opção 2: Deploy via Dashboard (Sem CLI)

### Para cada aplicação (Frontend, Admin, Business):

1. **Acesse**: https://vercel.com/new

2. **Import Repository**:
   - Conecte sua conta GitHub
   - Selecione o repositório `txopela-tour-mvp`

3. **Configure o Projeto**:

#### Frontend Principal:
```
Project Name: txopela-tour
Framework: Vite
Root Directory: frontend-vite
Build Command: npm run build
Output Directory: dist
Environment Variables:
  VITE_API_URL = https://txopela-api.onrender.com/api
```

#### Admin App:
```
Project Name: txopela-admin
Framework: Vite
Root Directory: admin-app
Build Command: npm run build
Output Directory: dist
Environment Variables:
  VITE_API_URL = https://txopela-api.onrender.com/api
```

#### Business App:
```
Project Name: txopela-business
Framework: Vite
Root Directory: business-app
Build Command: npm run build
Output Directory: dist
Environment Variables:
  VITE_API_URL = https://txopela-api.onrender.com/api
```

4. **Clique em "Deploy"**

---

## ✅ Após o Deploy

### 1. Anote as URLs

Você receberá 3 URLs:
- `https://txopela-tour.vercel.app` (Frontend)
- `https://txopela-admin.vercel.app` (Admin)
- `https://txopela-business.vercel.app` (Business)

### 2. Atualizar CORS no Render

1. Acesse: https://dashboard.render.com
2. Selecione `txopela-api`
3. Vá em "Environment"
4. Edite `CORS_ALLOWED_ORIGINS`:

```
https://txopela-tour.vercel.app,https://txopela-admin.vercel.app,https://txopela-business.vercel.app
```

5. Salve (redeploy automático)

### 3. Testar Tudo

Execute:
```bash
TEST-RENDER-API.bat
```

Ou teste manualmente:
- [ ] Abra cada URL
- [ ] Teste o chat IA
- [ ] Teste login/registro
- [ ] Verifique se os pontos aparecem

---

## 🔧 Problemas Comuns

### "Command not found: vercel"

**Solução**:
```bash
npm install -g vercel
```

### "Failed to compile"

**Solução**:
```bash
# Teste local primeiro
cd [pasta-do-app]
npm install
npm run build
```

### "API request failed"

**Solução**:
1. Verifique se a API está online: https://txopela-api.onrender.com/api/pontos-turisticos/
2. Verifique CORS no Render
3. Verifique `.env.production` em cada app

### Deploy não atualiza

**Solução**:
```bash
vercel --force --prod
```

---

## 📊 Verificar Status

### Via CLI:
```bash
vercel ls
```

### Via Dashboard:
https://vercel.com/dashboard

---

## 🎯 Próximos Passos

Após deploy bem-sucedido:

1. ✅ Testar todas as funcionalidades
2. ✅ Configurar domínios customizados (opcional)
3. ✅ Adicionar Google Analytics
4. ✅ Configurar SEO
5. ✅ Adicionar mais conteúdo

---

## 📞 Precisa de Ajuda?

Consulte:
- `DEPLOY-VERCEL-COMPLETO.md` - Guia detalhado
- `RENDER-TROUBLESHOOTING.md` - Problemas com API
- Documentação Vercel: https://vercel.com/docs
