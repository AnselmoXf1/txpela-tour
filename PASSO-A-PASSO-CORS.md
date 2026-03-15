# 🎯 Passo a Passo: Corrigir CORS (5 minutos)

## 📝 O que vamos fazer:

1. ✅ Fazer push do código corrigido
2. ✅ Configurar variável no Render
3. ✅ Testar o frontend

---

## 🚀 PASSO 1: Deploy do Código Corrigido

Execute o script:

```bash
DEPLOY-CORS-FIX.bat
```

Ou manualmente:

```bash
git add backend/txopela_backend/settings.py
git commit -m "Fix CORS configuration for production"
git push origin main
```

**Resultado esperado:**
```
✅ Enumerating objects: X, done.
✅ Writing objects: 100% (X/X), done.
✅ To github.com:seu-usuario/txopela-tour-mvp.git
```

---

## 🔧 PASSO 2: Configurar Variável no Render

### 2.1 Acessar Dashboard

1. Abra: https://dashboard.render.com
2. Faça login
3. Clique no serviço **`txopela-api`**

### 2.2 Ir para Environment Variables

1. No menu lateral esquerdo, clique em **"Environment"**
2. Você verá uma lista de variáveis

### 2.3 Encontrar CORS_ALLOWED_ORIGINS

Procure pela variável **`CORS_ALLOWED_ORIGINS`**

**Se EXISTIR:**
- Clique no ícone de **lápis** (Edit)
- Vá para o passo 2.4

**Se NÃO EXISTIR:**
- Clique em **"Add Environment Variable"**
- Key: `CORS_ALLOWED_ORIGINS`
- Vá para o passo 2.4

### 2.4 Atualizar o Valor

Cole exatamente este valor (copie e cole):

```
https://txopela-tour.vercel.app,https://txopela-admin.vercel.app,https://txopela-business.vercel.app
```

**⚠️ IMPORTANTE:**
- ✅ Sem espaços
- ✅ Separado por vírgulas
- ✅ Começa com `https://`
- ✅ Sem barra `/` no final

### 2.5 Salvar

1. Clique em **"Save Changes"**
2. Aparecerá uma mensagem: "Your service will be redeployed"
3. Clique em **"Save"** novamente para confirmar

---

## ⏳ PASSO 3: Aguardar Deploy

### 3.1 Acompanhar o Deploy

1. Você será redirecionado para a página de Logs
2. Aguarde o deploy completar
3. Procure por mensagens como:
   ```
   ✅ Build successful
   ✅ Starting service...
   ✅ Listening at: http://0.0.0.0:10000
   ```

### 3.2 Verificar Status

1. No topo da página, verifique o status
2. Deve mudar de:
   - 🟡 "Deploying..." → 🟢 "Live"

**Tempo estimado:** 2-3 minutos

---

## 🧪 PASSO 4: Testar o Frontend

### 4.1 Limpar Cache do Navegador

1. Abra o frontend: https://txopela-tour.vercel.app
2. Pressione **Ctrl + Shift + R** (ou Cmd + Shift + R no Mac)
3. Ou: Ctrl + F5

### 4.2 Abrir Console do Navegador

1. Pressione **F12**
2. Clique na aba **"Console"**
3. Recarregue a página

### 4.3 Verificar Erros

**❌ ANTES (com erro):**
```
Access to XMLHttpRequest... has been blocked by CORS policy
Failed to fetch points: AxiosError: Network Error
```

**✅ DEPOIS (funcionando):**
```
(sem erros de CORS)
(pontos turísticos carregam)
```

### 4.4 Verificar Funcionalidades

- [ ] Pontos turísticos aparecem no mapa
- [ ] Lista de pontos carrega
- [ ] Imagens aparecem
- [ ] Chat IA funciona
- [ ] Filtros funcionam

---

## 🎉 Sucesso!

Se tudo funcionou, você verá:

✅ Sem erros no console
✅ Pontos turísticos carregando
✅ Chat IA respondendo
✅ Imagens aparecendo

---

## 🐛 Troubleshooting

### Ainda aparece erro de CORS?

#### Verificação 1: Variável no Render

1. Volte ao Render → Environment
2. Verifique se `CORS_ALLOWED_ORIGINS` está lá
3. Verifique se o valor está correto (sem espaços!)

#### Verificação 2: Deploy Concluído

1. Verifique se o status está "Live" (verde)
2. Verifique os logs para erros
3. Procure por: "Listening at: http://0.0.0.0:10000"

#### Verificação 3: URL Correta

Verifique se a URL do frontend está correta:
- ✅ `https://txopela-tour.vercel.app`
- ❌ `https://txopela-tour-git-main.vercel.app` (URL de preview)

#### Verificação 4: Cache

1. Limpe o cache do navegador completamente
2. Ou teste em aba anônima (Ctrl + Shift + N)

#### Verificação 5: Teste Direto

No console do navegador (F12), execute:

```javascript
fetch('https://txopela-api.onrender.com/api/pontos-turisticos/')
  .then(r => r.json())
  .then(d => console.log('✅ Funcionou!', d))
  .catch(e => console.error('❌ Erro:', e))
```

Se aparecer `✅ Funcionou!` e os dados, o CORS está OK!

---

## 🔄 Se Nada Funcionar

### Solução Temporária (apenas para teste):

1. No Render → Environment
2. Adicione nova variável:
   - Key: `CORS_ALLOW_ALL_ORIGINS`
   - Value: `True`
3. Salve e aguarde redeploy

**⚠️ ATENÇÃO:** Isso permite QUALQUER origem acessar sua API. Use apenas para teste!

Se funcionar com isso, o problema é na configuração da lista de origens.

---

## 📞 Precisa de Ajuda?

Consulte:
- `FIX-CORS-RENDER.md` - Guia detalhado
- `RENDER-TROUBLESHOOTING.md` - Problemas gerais
- Logs do Render - Para ver erros específicos

---

## ✅ Checklist Final

- [ ] Código commitado e pushed
- [ ] Deploy do Render concluído
- [ ] Status "Live" no Render
- [ ] Variável CORS_ALLOWED_ORIGINS configurada
- [ ] Frontend recarregado (Ctrl+F5)
- [ ] Sem erros de CORS no console
- [ ] Pontos turísticos carregando
- [ ] Chat IA funcionando

**Se todos os itens estão marcados, está tudo funcionando! 🎉**
