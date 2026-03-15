# ⚡ Comandos Rápidos de Deploy

## 🚀 Deploy Completo (Tudo de Uma Vez)

### Windows:
```bash
DEPLOY-ALL-VERCEL.bat
```

### Manual:
```bash
# 1. Frontend
cd frontend-vite
npm install
npm run build
vercel --prod

# 2. Admin
cd ../admin-app
npm install
npm run build
vercel --prod

# 3. Business
cd ../business-app
npm install
npm run build
vercel --prod
```

---

## 📦 Deploy Individual

### Frontend Principal:
```bash
cd frontend-vite
vercel --prod
```

### Admin App:
```bash
cd admin-app
vercel --prod
```

### Business App:
```bash
cd business-app
vercel --prod
```

---

## 🔄 Redeploy (Forçar)

### Forçar novo deploy:
```bash
vercel --force --prod
```

### Limpar cache e redeploy:
```bash
vercel --force --prod --no-cache
```

---

## 🧪 Testar Antes do Deploy

### Build local:
```bash
# Frontend
cd frontend-vite && npm run build

# Admin
cd admin-app && npm run build

# Business
cd business-app && npm run build
```

### Preview local:
```bash
# Frontend
cd frontend-vite && npm run preview

# Admin
cd admin-app && npm run preview

# Business
cd business-app && npm run preview
```

---

## 🔍 Verificar Status

### Listar deploys:
```bash
vercel ls
```

### Ver logs:
```bash
vercel logs [deployment-url]
```

### Inspecionar deploy:
```bash
vercel inspect [deployment-url]
```

---

## 🌐 Testar API

### Teste rápido:
```bash
curl https://txopela-api.onrender.com/api/pontos-turisticos/
```

### Teste completo:
```bash
python test_api_render.py
```

### Windows:
```bash
TEST-RENDER-API.bat
```

---

## 🔧 Configuração Inicial

### Instalar Vercel CLI:
```bash
npm install -g vercel
```

### Login:
```bash
vercel login
```

### Link projeto existente:
```bash
vercel link
```

---

## 📝 Variáveis de Ambiente

### Adicionar variável:
```bash
vercel env add VITE_API_URL production
```

### Listar variáveis:
```bash
vercel env ls
```

### Remover variável:
```bash
vercel env rm VITE_API_URL production
```

---

## 🔄 Git + Deploy Automático

### Commit e push (deploy automático):
```bash
git add .
git commit -m "Update frontend"
git push origin main
```

### Commit vazio (forçar deploy):
```bash
git commit --allow-empty -m "Force deploy"
git push origin main
```

---

## 🎯 Aliases e Domínios

### Adicionar alias:
```bash
vercel alias [deployment-url] [custom-domain]
```

### Exemplo:
```bash
vercel alias txopela-tour.vercel.app www.txopela.co.mz
```

---

## 🐛 Debug

### Ver logs em tempo real:
```bash
vercel logs --follow
```

### Ver logs de build:
```bash
vercel logs --build
```

### Ver logs de runtime:
```bash
vercel logs --runtime
```

---

## 🗑️ Remover Deploy

### Remover deployment específico:
```bash
vercel rm [deployment-url]
```

### Remover projeto:
```bash
vercel remove [project-name]
```

---

## 📊 Informações do Projeto

### Ver detalhes:
```bash
vercel inspect
```

### Ver domínios:
```bash
vercel domains ls
```

### Ver certificados SSL:
```bash
vercel certs ls
```

---

## 🔐 Secrets (Variáveis Sensíveis)

### Adicionar secret:
```bash
vercel secrets add api-key "sua-chave-aqui"
```

### Listar secrets:
```bash
vercel secrets ls
```

### Usar secret em env:
```bash
vercel env add GEMINI_API_KEY @api-key production
```

---

## 🚀 Deploy de Produção vs Preview

### Deploy de preview (teste):
```bash
vercel
```

### Deploy de produção:
```bash
vercel --prod
```

### Promover preview para produção:
```bash
vercel promote [deployment-url]
```

---

## 📱 Testar em Dispositivos

### Gerar QR code para mobile:
```bash
vercel dev --qr
```

### Compartilhar preview:
```bash
vercel --public
```

---

## 🔄 Rollback

### Listar deploys anteriores:
```bash
vercel ls
```

### Promover deploy antigo:
```bash
vercel promote [old-deployment-url]
```

---

## 🎨 Customização

### Configurar build:
```bash
# Editar vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Configurar redirects:
```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

---

## 📞 Ajuda

### Ver ajuda geral:
```bash
vercel --help
```

### Ver ajuda de comando específico:
```bash
vercel deploy --help
vercel env --help
vercel logs --help
```

---

## 🎯 Atalhos Úteis

### Deploy rápido:
```bash
v --prod  # v é alias de vercel
```

### Ver status:
```bash
v ls
```

### Ver logs:
```bash
v logs
```

---

## 📋 Checklist Rápido

Antes de cada deploy:

```bash
# 1. Testar local
npm run build

# 2. Verificar env
cat .env.production

# 3. Deploy
vercel --prod

# 4. Testar produção
curl [sua-url]

# 5. Verificar logs
vercel logs
```

---

## 🆘 Comandos de Emergência

### Se algo der errado:

```bash
# 1. Rollback imediato
vercel ls
vercel promote [ultimo-deploy-funcionando]

# 2. Ver o que aconteceu
vercel logs --follow

# 3. Forçar redeploy
vercel --force --prod

# 4. Limpar tudo e recomeçar
vercel --force --prod --no-cache
```
