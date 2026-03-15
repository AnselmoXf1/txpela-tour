# 🔧 Troubleshooting - API no Render

## Problema: "Not Found - The requested resource was not found"

### Causas Comuns:

1. **Endpoint raiz não configurado** ✅ CORRIGIDO
   - Adicionamos um endpoint `/` que retorna informações da API

2. **URL incorreta**
   - Certifique-se de usar: `https://txopela-api.onrender.com`
   - Não: `https://txopela-api.onrender.com/api` (para o root)

3. **Serviço não iniciado**
   - Verifique no dashboard do Render se o deploy foi concluído
   - Status deve estar "Live" (verde)

4. **Erro no build**
   - Verifique os logs de build no Render
   - Procure por erros de instalação de dependências

5. **Erro no start**
   - Verifique os logs de runtime no Render
   - Procure por erros do Django/Gunicorn

---

## ✅ Checklist de Verificação

### 1. Verificar Status no Render Dashboard
```
1. Acesse: https://dashboard.render.com
2. Clique no serviço "txopela-api"
3. Verifique:
   - Status: deve estar "Live" (verde)
   - Last Deploy: deve ser recente
   - Health Check: deve estar passando
```

### 2. Verificar Logs de Build
```
No dashboard do Render:
1. Clique em "Logs"
2. Selecione "Build Logs"
3. Procure por:
   ✅ "Successfully installed..."
   ❌ "ERROR:", "FAILED:", "ModuleNotFoundError"
```

### 3. Verificar Logs de Runtime
```
No dashboard do Render:
1. Clique em "Logs"
2. Selecione "Deploy Logs" ou "Live Logs"
3. Procure por:
   ✅ "Booting worker with pid"
   ✅ "Listening at: http://0.0.0.0:10000"
   ❌ "Error:", "Exception:", "Traceback"
```

### 4. Verificar Variáveis de Ambiente
```
No dashboard do Render:
1. Clique em "Environment"
2. Verifique se estão configuradas:
   ✅ SECRET_KEY (gerado automaticamente)
   ✅ DEBUG = False
   ✅ ALLOWED_HOSTS = .onrender.com
   ✅ MONGODB_URI (seu MongoDB Atlas)
   ✅ MONGODB_DB_NAME = txopito_ia_db
   ✅ GEMINI_API_KEY (sua chave do Gemini)
   ✅ CLOUDINARY_CLOUD_NAME
   ✅ CLOUDINARY_API_KEY
   ✅ CLOUDINARY_API_SECRET
   ✅ CORS_ALLOWED_ORIGINS (suas URLs do Vercel)
```

---

## 🧪 Testar a API

### Teste 1: Endpoint Raiz (Novo!)
```bash
curl https://txopela-api.onrender.com/
```

Resposta esperada:
```json
{
  "status": "online",
  "message": "Txopela Tour API",
  "version": "1.0",
  "endpoints": {
    "pontos_turisticos": "/api/pontos-turisticos/",
    "ai_chat": "/api/ai/chat/",
    "authentication": "/api/auth/",
    "business_panel": "/api/business/",
    "admin": "/admin/"
  }
}
```

### Teste 2: Pontos Turísticos
```bash
curl https://txopela-api.onrender.com/api/pontos-turisticos/
```

### Teste 3: Health Check AI
```bash
curl https://txopela-api.onrender.com/api/ai/health/
```

### Teste 4: Script Python
```bash
python test_api_render.py
```

---

## 🔄 Forçar Novo Deploy

Se nada funcionar, force um novo deploy:

### Opção 1: Via Dashboard
```
1. Acesse o dashboard do Render
2. Clique em "Manual Deploy"
3. Selecione "Clear build cache & deploy"
```

### Opção 2: Via Git
```bash
# Faça um commit vazio para forçar deploy
git commit --allow-empty -m "Force Render redeploy"
git push origin main
```

---

## 🐛 Problemas Específicos

### Erro: "Application failed to respond"
**Causa:** Gunicorn não conseguiu iniciar o Django

**Solução:**
1. Verifique se `txopela_backend.wsgi:application` está correto
2. Verifique se todas as dependências estão em `requirements.txt`
3. Verifique logs para erros de importação

### Erro: "ModuleNotFoundError"
**Causa:** Dependência faltando

**Solução:**
1. Adicione a dependência em `backend/requirements.txt`
2. Faça commit e push
3. Aguarde novo deploy

### Erro: "ALLOWED_HOSTS"
**Causa:** Django bloqueando requisições

**Solução:**
1. Verifique variável `ALLOWED_HOSTS` no Render
2. Deve conter: `.onrender.com`
3. Ou adicione o domínio específico: `txopela-api.onrender.com`

### Erro: "CORS"
**Causa:** Frontend não consegue acessar API

**Solução:**
1. Verifique `CORS_ALLOWED_ORIGINS` no Render
2. Deve conter suas URLs do Vercel:
   ```
   https://txopela-tour.vercel.app,https://txopela-admin.vercel.app,https://txopela-business.vercel.app
   ```

---

## 📊 Monitoramento

### Verificar Saúde do Serviço
```bash
# Deve retornar 200 OK
curl -I https://txopela-api.onrender.com/
```

### Verificar Tempo de Resposta
```bash
# Primeira requisição pode demorar (cold start)
time curl https://txopela-api.onrender.com/

# Requisições seguintes devem ser rápidas
time curl https://txopela-api.onrender.com/
```

### Logs em Tempo Real
```
No dashboard do Render:
1. Clique em "Logs"
2. Ative "Auto-scroll"
3. Faça requisições e observe os logs
```

---

## 🆘 Ainda não funciona?

1. **Verifique se o serviço está no plano Free**
   - Plano Free hiberna após 15 minutos de inatividade
   - Primeira requisição pode demorar 30-60 segundos

2. **Teste localmente primeiro**
   ```bash
   cd backend
   python manage.py runserver
   # Teste: http://localhost:8000/
   ```

3. **Compare configurações**
   - Local funcionando? Compare settings.py
   - Verifique diferenças entre local e produção

4. **Contate o suporte do Render**
   - Se tudo estiver correto e ainda não funcionar
   - Pode ser um problema na plataforma

---

## 📝 Próximos Passos

Após corrigir o problema:

1. ✅ Teste todos os endpoints com `test_api_render.py`
2. ✅ Configure as URLs nos frontends (Vercel)
3. ✅ Teste integração completa
4. ✅ Configure domínio customizado (opcional)
5. ✅ Configure monitoramento (UptimeRobot, etc.)
