# 🚀 Deploy Completo no Vercel - 3 Interfaces

## 📋 Visão Geral

Vamos fazer deploy de 3 aplicações separadas no Vercel:

1. **Frontend Principal** (Txopela Tour) - `frontend-vite/`
2. **Admin App** (Painel Admin) - `admin-app/`
3. **Business App** (Painel Empresas) - `business-app/`

Cada uma terá sua própria URL no Vercel.

---

## ✅ Pré-requisitos

- [x] Conta no Vercel (https://vercel.com)
- [x] Repositório no GitHub
- [x] API funcionando no Render
- [x] Arquivos `.env.production` criados

---

## 🎯 Deploy 1: Frontend Principal (Txopela Tour)

### Passo 1: Preparar o Projeto

```bash
cd frontend-vite
npm install
npm run build
```

### Passo 2: Deploy no Vercel

#### Opção A: Via CLI (Recomendado)

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm install -g vercel

# Fazer login
vercel login

# Deploy
cd frontend-vite
vercel

# Seguir as instruções:
# - Set up and deploy? Yes
# - Which scope? (sua conta)
# - Link to existing project? No
# - Project name? txopela-tour
# - Directory? ./
# - Override settings? No

# Deploy para produção
vercel --prod
```

#### Opção B: Via Dashboard

1. Acesse: https://vercel.com/new
2. Clique em "Import Git Repository"
3. Selecione seu repositório
4. Configure:
   - **Project Name**: `txopela-tour`
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend-vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Environment Variables**:
   ```
   VITE_API_URL = https://txopela-api.onrender.com/api
   ```

6. Clique em "Deploy"

### Passo 3: Verificar Deploy

URL esperada: `https://txopela-tour.vercel.app`

Teste:
- [ ] Página inicial carrega
- [ ] Mapa de Moçambique aparece
- [ ] Chat IA funciona
- [ ] Pontos turísticos aparecem

---

## 🎯 Deploy 2: Admin App

### Passo 1: Preparar o Projeto

```bash
cd admin-app
npm install
npm run build
```

### Passo 2: Deploy no Vercel

#### Via CLI:

```bash
cd admin-app
vercel

# Configurações:
# - Project name? txopela-admin
# - Directory? ./

vercel --prod
```

#### Via Dashboard:

1. Acesse: https://vercel.com/new
2. Selecione o mesmo repositório
3. Configure:
   - **Project Name**: `txopela-admin`
   - **Framework Preset**: Vite
   - **Root Directory**: `admin-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL = https://txopela-api.onrender.com/api
   ```

5. Deploy

### Passo 3: Verificar Deploy

URL esperada: `https://txopela-admin.vercel.app`

Teste:
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] CRUD de pontos funciona
- [ ] Analytics aparecem

---

## 🎯 Deploy 3: Business App

### Passo 1: Preparar o Projeto

```bash
cd business-app
npm install
npm run build
```

### Passo 2: Deploy no Vercel

#### Via CLI:

```bash
cd business-app
vercel

# Configurações:
# - Project name? txopela-business

vercel --prod
```

#### Via Dashboard:

1. Acesse: https://vercel.com/new
2. Selecione o mesmo repositório
3. Configure:
   - **Project Name**: `txopela-business`
   - **Framework Preset**: Vite
   - **Root Directory**: `business-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL = https://txopela-api.onrender.com/api
   ```

5. Deploy

### Passo 3: Verificar Deploy

URL esperada: `https://txopela-business.vercel.app`

Teste:
- [ ] Registro de empresa funciona
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Cadastro de pontos funciona

---

## 🔄 Atualizar CORS no Backend

Após obter as URLs do Vercel, atualize o CORS no Render:

1. Acesse: https://dashboard.render.com
2. Selecione `txopela-api`
3. Vá em "Environment"
4. Edite `CORS_ALLOWED_ORIGINS`:

```
https://txopela-tour.vercel.app,https://txopela-admin.vercel.app,https://txopela-business.vercel.app
```

5. Salve (vai fazer redeploy automático)

---

## 📝 Resumo das URLs

Após o deploy, você terá:

| Aplicação | URL | Descrição |
|-----------|-----|-----------|
| API | https://txopela-api.onrender.com | Backend Django |
| Frontend | https://txopela-tour.vercel.app | Site principal |
| Admin | https://txopela-admin.vercel.app | Painel admin |
| Business | https://txopela-business.vercel.app | Painel empresas |

---

## 🔧 Troubleshooting

### Erro: "Failed to compile"

**Causa**: Erro de build

**Solução**:
```bash
# Teste localmente primeiro
cd [pasta-do-app]
npm install
npm run build

# Se funcionar local, limpe cache do Vercel
vercel --force
```

### Erro: "API request failed"

**Causa**: CORS ou URL incorreta

**Solução**:
1. Verifique `.env.production`
2. Verifique CORS no Render
3. Teste API diretamente: `curl https://txopela-api.onrender.com/api/pontos-turisticos/`

### Erro: "Module not found"

**Causa**: Dependência faltando

**Solução**:
```bash
# Verifique package.json
npm install
npm run build
```

### Deploy não atualiza

**Causa**: Cache do Vercel

**Solução**:
```bash
# Forçar novo deploy
vercel --force --prod

# Ou no dashboard: Deployments > ... > Redeploy
```

---

## 🎨 Customizar Domínios (Opcional)

### Adicionar Domínio Customizado

1. No dashboard do Vercel
2. Selecione o projeto
3. Settings > Domains
4. Add Domain
5. Configure DNS:
   - Tipo: CNAME
   - Nome: www (ou @)
   - Valor: cname.vercel-dns.com

Exemplos:
- `www.txopela.co.mz` → Frontend
- `admin.txopela.co.mz` → Admin
- `business.txopela.co.mz` → Business

---

## 🔄 Deploy Automático

### Configurar Deploy Automático

Por padrão, o Vercel já faz deploy automático quando você faz push para o GitHub.

Para cada projeto:
1. Settings > Git
2. Configure:
   - **Production Branch**: `main`
   - **Deploy Hooks**: Ativado

Agora, sempre que fizer:
```bash
git add .
git commit -m "Update frontend"
git push origin main
```

O Vercel fará deploy automático!

---

## 📊 Monitoramento

### Verificar Status dos Deploys

```bash
# Via CLI
vercel ls

# Ver logs
vercel logs [deployment-url]
```

### Dashboard do Vercel

1. Acesse: https://vercel.com/dashboard
2. Veja todos os projetos
3. Clique em cada um para ver:
   - Status do deploy
   - Logs
   - Analytics
   - Performance

---

## 🚀 Scripts Úteis

### Deploy Tudo de Uma Vez

```bash
# Deploy todos os frontends
cd frontend-vite && vercel --prod && cd ..
cd admin-app && vercel --prod && cd ..
cd business-app && vercel --prod && cd ..
```

### Testar Builds Localmente

```bash
# Frontend
cd frontend-vite && npm run build && npm run preview

# Admin
cd admin-app && npm run build && npm run preview

# Business
cd business-app && npm run build && npm run preview
```

---

## ✅ Checklist Final

Após todos os deploys:

- [ ] Frontend principal funcionando
- [ ] Admin app funcionando
- [ ] Business app funcionando
- [ ] API respondendo corretamente
- [ ] CORS configurado com todas as URLs
- [ ] Chat IA funcionando em todos
- [ ] Login/Registro funcionando
- [ ] Imagens carregando (Cloudinary)
- [ ] Responsivo em mobile
- [ ] Performance OK (Lighthouse)

---

## 🎉 Pronto!

Sua plataforma está no ar com:
- ✅ Backend no Render
- ✅ 3 Frontends no Vercel
- ✅ MongoDB Atlas
- ✅ Cloudinary para imagens
- ✅ Gemini AI para chat

Próximos passos:
1. Testar tudo em produção
2. Configurar domínios customizados
3. Adicionar analytics (Google Analytics, etc.)
4. Configurar SEO
5. Adicionar mais conteúdo
