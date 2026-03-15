# ✅ Checklist de Deploy - Plataforma Txopela

## 📋 Pré-Deploy

### Backend (Render)
- [ ] Conta criada no Render
- [ ] Repositório conectado
- [ ] Variáveis de ambiente configuradas:
  - [ ] SECRET_KEY
  - [ ] DEBUG = False
  - [ ] ALLOWED_HOSTS = .onrender.com
  - [ ] MONGODB_URI
  - [ ] MONGODB_DB_NAME
  - [ ] GEMINI_API_KEY
  - [ ] CLOUDINARY_CLOUD_NAME
  - [ ] CLOUDINARY_API_KEY
  - [ ] CLOUDINARY_API_SECRET
  - [ ] CORS_ALLOWED_ORIGINS
- [ ] Deploy concluído
- [ ] Status: Live (verde)
- [ ] API testada: https://txopela-api.onrender.com/api/pontos-turisticos/

### Frontends (Vercel)
- [ ] Conta criada no Vercel
- [ ] Vercel CLI instalado: `npm install -g vercel`
- [ ] Login feito: `vercel login`
- [ ] Arquivos `.env.production` criados

---

## 🚀 Deploy

### 1. Frontend Principal (Txopela Tour)
- [ ] Build local testado: `cd frontend-vite && npm run build`
- [ ] Deploy feito: `vercel --prod`
- [ ] URL obtida: `https://txopela-tour.vercel.app`
- [ ] Site abre corretamente
- [ ] Mapa de Moçambique aparece
- [ ] Chat IA funciona
- [ ] Pontos turísticos carregam

### 2. Admin App
- [ ] Build local testado: `cd admin-app && npm run build`
- [ ] Deploy feito: `vercel --prod`
- [ ] URL obtida: `https://txopela-admin.vercel.app`
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] CRUD de pontos funciona
- [ ] Analytics aparecem

### 3. Business App
- [ ] Build local testado: `cd business-app && npm run build`
- [ ] Deploy feito: `vercel --prod`
- [ ] URL obtida: `https://txopela-business.vercel.app`
- [ ] Registro de empresa funciona
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Cadastro de pontos funciona

---

## 🔧 Configuração Pós-Deploy

### CORS no Backend
- [ ] Acessado dashboard do Render
- [ ] Variável CORS_ALLOWED_ORIGINS atualizada com as 3 URLs do Vercel
- [ ] Redeploy automático concluído
- [ ] CORS testado (sem erros no console do navegador)

### DNS e Domínios (Opcional)
- [ ] Domínio customizado adquirido
- [ ] DNS configurado no Vercel
- [ ] SSL/HTTPS ativo
- [ ] Redirecionamento www configurado

---

## 🧪 Testes de Integração

### Frontend Principal
- [ ] Página inicial carrega em < 3 segundos
- [ ] Mapa interativo funciona
- [ ] Filtros de categoria funcionam
- [ ] Busca funciona
- [ ] Chat IA responde corretamente
- [ ] Imagens carregam (Cloudinary)
- [ ] Responsivo em mobile
- [ ] Sem erros no console

### Admin App
- [ ] Login com credenciais corretas
- [ ] Dashboard mostra estatísticas
- [ ] Criar novo ponto turístico
- [ ] Editar ponto existente
- [ ] Deletar ponto
- [ ] Upload de imagens funciona
- [ ] Analytics carregam
- [ ] Logout funciona

### Business App
- [ ] Registro de nova empresa
- [ ] Login com empresa criada
- [ ] Dashboard carrega
- [ ] Criar novo ponto/serviço
- [ ] Editar ponto próprio
- [ ] Upload de imagens funciona
- [ ] Estatísticas aparecem
- [ ] Logout funciona

---

## 🔍 Testes de Performance

### Lighthouse (Chrome DevTools)
- [ ] Performance > 80
- [ ] Accessibility > 90
- [ ] Best Practices > 80
- [ ] SEO > 80

### Testes Manuais
- [ ] Testado em Chrome
- [ ] Testado em Firefox
- [ ] Testado em Safari
- [ ] Testado em mobile (Android)
- [ ] Testado em mobile (iOS)
- [ ] Testado em tablet

---

## 🔒 Segurança

### Backend
- [ ] DEBUG = False em produção
- [ ] SECRET_KEY único e seguro
- [ ] HTTPS ativo
- [ ] CORS configurado corretamente
- [ ] Rate limiting configurado (opcional)
- [ ] Logs de erro configurados

### Frontends
- [ ] Variáveis sensíveis não expostas
- [ ] HTTPS ativo (Vercel automático)
- [ ] Headers de segurança configurados
- [ ] Sem console.log em produção

---

## 📊 Monitoramento

### Configurar (Opcional)
- [ ] Google Analytics instalado
- [ ] Sentry para error tracking
- [ ] UptimeRobot para monitorar uptime
- [ ] Hotjar para heatmaps (opcional)

### Verificações Diárias
- [ ] API está online
- [ ] Frontends estão online
- [ ] Sem erros críticos nos logs
- [ ] Performance OK

---

## 📝 Documentação

### Criar/Atualizar
- [ ] README.md com instruções
- [ ] Documentação da API
- [ ] Guia de uso para admins
- [ ] Guia de uso para empresas
- [ ] Changelog de versões

---

## 🎉 Launch

### Pré-Launch
- [ ] Todos os testes passaram
- [ ] Backup do banco de dados
- [ ] Plano de rollback definido
- [ ] Equipe notificada

### Launch
- [ ] Anúncio nas redes sociais
- [ ] Email para usuários beta
- [ ] Press release (se aplicável)
- [ ] Monitoramento ativo

### Pós-Launch
- [ ] Monitorar erros nas primeiras 24h
- [ ] Coletar feedback dos usuários
- [ ] Corrigir bugs críticos imediatamente
- [ ] Planejar próximas features

---

## 🔄 Manutenção Contínua

### Semanal
- [ ] Verificar logs de erro
- [ ] Atualizar dependências (se necessário)
- [ ] Backup do banco de dados
- [ ] Revisar analytics

### Mensal
- [ ] Atualizar conteúdo
- [ ] Adicionar novos pontos turísticos
- [ ] Revisar performance
- [ ] Planejar novas features

---

## 📞 Contatos Importantes

### Serviços
- Render: https://dashboard.render.com
- Vercel: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com
- Cloudinary: https://cloudinary.com/console
- Google AI Studio: https://makersuite.google.com

### Suporte
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- MongoDB: https://docs.mongodb.com

---

## ✅ Status Final

- [ ] Backend: ✅ Online
- [ ] Frontend: ✅ Online
- [ ] Admin: ✅ Online
- [ ] Business: ✅ Online
- [ ] Todos os testes: ✅ Passaram
- [ ] Documentação: ✅ Completa
- [ ] Monitoramento: ✅ Ativo

**Data do Deploy**: _______________

**Responsável**: _______________

**Notas**: 
_________________________________
_________________________________
_________________________________
