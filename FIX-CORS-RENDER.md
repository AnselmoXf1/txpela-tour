# 🔧 Corrigir CORS no Render - URGENTE

## ❌ Problema Atual

```
Access to XMLHttpRequest at 'https://txopela-api.onrender.com/api/pontos-turisticos/' 
from origin 'https://txopela-tour.vercel.app' has been blocked by CORS policy
```

## ✅ Solução Rápida

### Passo 1: Acessar Dashboard do Render

1. Acesse: https://dashboard.render.com
2. Faça login
3. Clique no serviço **`txopela-api`**

### Passo 2: Atualizar Variável CORS_ALLOWED_ORIGINS

1. No menu lateral, clique em **"Environment"**
2. Procure a variável **`CORS_ALLOWED_ORIGINS`**
3. Clique em **"Edit"** (ícone de lápis)
4. **SUBSTITUA** o valor atual por:

```
https://txopela-tour.vercel.app,https://txopela-admin.vercel.app,https://txopela-business.vercel.app
```

**IMPORTANTE**: 
- Sem espaços entre as URLs
- Separadas apenas por vírgula
- Sem barra no final das URLs

5. Clique em **"Save Changes"**

### Passo 3: Aguardar Redeploy

O Render vai fazer redeploy automático (2-3 minutos).

Aguarde até o status voltar para **"Live"** (verde).

### Passo 4: Testar

Recarregue a página do frontend:
- https://txopela-tour.vercel.app

Os erros de CORS devem desaparecer!

---

## 🔍 Verificar se Funcionou

### No Console do Navegador (F12):

**Antes (com erro):**
```
❌ Access to XMLHttpRequest... has been blocked by CORS policy
```

**Depois (funcionando):**
```
✅ Sem erros de CORS
✅ Pontos turísticos carregam
✅ Chat funciona
```

---

## 🐛 Se Ainda Não Funcionar

### Opção 1: Verificar Configuração do Django

Verifique se o arquivo `backend/txopela_backend/settings.py` tem:

```python
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
```

Se não tiver, adicione e faça commit:

```bash
git add backend/txopela_backend/settings.py
git commit -m "Fix CORS configuration"
git push origin main
```

### Opção 2: Adicionar CORS_ALLOW_ALL_ORIGINS (Temporário)

**APENAS PARA TESTE** - Não use em produção permanentemente!

No Render, adicione uma nova variável:
```
CORS_ALLOW_ALL_ORIGINS = True
```

Se funcionar, o problema é na configuração da lista de origens.

### Opção 3: Verificar Logs do Render

1. No dashboard do Render
2. Clique em **"Logs"**
3. Procure por erros relacionados a CORS
4. Verifique se a variável está sendo lida corretamente

---

## 📋 Checklist de Verificação

- [ ] Variável `CORS_ALLOWED_ORIGINS` existe no Render
- [ ] Valor contém as 3 URLs do Vercel
- [ ] URLs estão separadas por vírgula (sem espaços)
- [ ] URLs começam com `https://`
- [ ] URLs não têm barra no final
- [ ] Redeploy foi concluído
- [ ] Status está "Live"
- [ ] Frontend recarregado (Ctrl+F5)
- [ ] Cache do navegador limpo

---

## 🎯 Valor Correto da Variável

Copie e cole exatamente isso:

```
https://txopela-tour.vercel.app,https://txopela-admin.vercel.app,https://txopela-business.vercel.app
```

---

## 🔄 Alternativa: Atualizar via settings.py

Se preferir configurar direto no código:

```python
# backend/txopela_backend/settings.py

# Substituir:
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')

# Por:
CORS_ALLOWED_ORIGINS = [
    'https://txopela-tour.vercel.app',
    'https://txopela-admin.vercel.app',
    'https://txopela-business.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001',
    'http://localhost:5174',
]
```

Depois:
```bash
git add backend/txopela_backend/settings.py
git commit -m "Update CORS origins"
git push origin main
```

---

## ⚡ Teste Rápido

Após a correção, teste no console do navegador (F12):

```javascript
fetch('https://txopela-api.onrender.com/api/pontos-turisticos/')
  .then(r => r.json())
  .then(d => console.log('✅ CORS OK!', d))
  .catch(e => console.log('❌ CORS Error:', e))
```

Se aparecer `✅ CORS OK!` e os dados, está funcionando!

---

## 📞 Ainda com Problemas?

1. Tire um print da tela de Environment Variables no Render
2. Tire um print dos erros no console do navegador
3. Verifique os logs do Render
4. Certifique-se que o serviço está "Live"

---

## 🎉 Após Corrigir

Teste todas as funcionalidades:
- [ ] Pontos turísticos carregam
- [ ] Chat IA funciona
- [ ] Imagens aparecem
- [ ] Filtros funcionam
- [ ] Busca funciona
- [ ] Login/Registro funciona (Admin e Business)
