# 🧪 COMANDOS PARA TESTAR A API

## 📍 URLs PARA TESTAR

### Local (desenvolvimento):
```
http://localhost:8000/api
```

### Produção (Render):
```
https://txopela-api.onrender.com/api
```

---

## 🔍 TESTES BÁSICOS

### 1. Health Check
```bash
# Local
curl http://localhost:8000/api/health/

# Produção
curl https://txopela-api.onrender.com/api/health/
```

### 2. Chat AI
```bash
# Local
curl -X POST http://localhost:8000/api/ai/chat/ \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"content": "Olá, me fale sobre Moçambique"}]}'

# Produção
curl -X POST https://txopela-api.onrender.com/api/ai/chat/ \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"content": "Olá, me fale sobre Moçambique"}]}'
```

### 3. Listar Pontos Turísticos
```bash
# Local
curl http://localhost:8000/api/pontos/

# Produção
curl https://txopela-api.onrender.com/api/pontos/
```

### 4. Buscar Ponto por ID
```bash
# Local
curl http://localhost:8000/api/pontos/1/

# Produção
curl https://txopela-api.onrender.com/api/pontos/1/
```

---

## 🐍 TESTE COM PYTHON

### Script de teste completo:
```bash
python test_api_render.py
```

### Teste manual:
```python
import requests

# URL da API
API_URL = "https://txopela-api.onrender.com/api"

# Teste Chat
response = requests.post(
    f"{API_URL}/ai/chat/",
    json={"messages": [{"content": "Olá"}]},
    headers={"Content-Type": "application/json"}
)

print(response.status_code)
print(response.json())
```

---

## 🌐 TESTE NO NAVEGADOR

### Abra no navegador:

1. **Health Check:**
   ```
   https://txopela-api.onrender.com/api/health/
   ```

2. **Admin Django:**
   ```
   https://txopela-api.onrender.com/admin/
   ```

3. **API Root:**
   ```
   https://txopela-api.onrender.com/api/
   ```

---

## 📊 TESTE COM POSTMAN

### 1. Importar Collection

Crie uma nova collection no Postman com:

**Request 1: Health Check**
- Method: GET
- URL: `{{API_URL}}/health/`

**Request 2: Chat AI**
- Method: POST
- URL: `{{API_URL}}/ai/chat/`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "messages": [
    {
      "content": "Olá, me fale sobre Moçambique"
    }
  ]
}
```

**Request 3: Listar Pontos**
- Method: GET
- URL: `{{API_URL}}/pontos/`

### 2. Configurar Environment

Crie um environment com:
```
API_URL = https://txopela-api.onrender.com/api
```

---

## 🧪 TESTE DE CARGA

### Com Apache Bench:
```bash
# Instalar (Ubuntu/Debian)
sudo apt install apache2-utils

# Teste de carga
ab -n 100 -c 10 https://txopela-api.onrender.com/api/health/
```

### Com wrk:
```bash
# Instalar
sudo apt install wrk

# Teste de carga
wrk -t4 -c100 -d30s https://txopela-api.onrender.com/api/health/
```

---

## 🔐 TESTE DE CORS

### Com JavaScript (Console do navegador):
```javascript
fetch('https://txopela-api.onrender.com/api/ai/chat/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [{content: 'Olá'}]
  })
})
.then(r => r.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

### Com curl:
```bash
curl -X OPTIONS https://txopela-api.onrender.com/api/ai/chat/ \
  -H "Origin: https://txopela-tour.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

---

## 📝 TESTE DE ENDPOINTS COMPLETOS

### 1. Criar Ponto Turístico
```bash
curl -X POST https://txopela-api.onrender.com/api/pontos/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Praia de Tofo",
    "descricao": "Linda praia em Inhambane",
    "categoria": "praia",
    "provincia": "Inhambane",
    "latitude": -23.8500,
    "longitude": 35.5500
  }'
```

### 2. Atualizar Ponto
```bash
curl -X PUT https://txopela-api.onrender.com/api/pontos/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Praia de Tofo - Atualizado",
    "descricao": "Linda praia em Inhambane - Atualizado"
  }'
```

### 3. Deletar Ponto
```bash
curl -X DELETE https://txopela-api.onrender.com/api/pontos/1/
```

---

## 🎯 TESTE DE INTEGRAÇÃO

### Teste completo do fluxo:
```bash
#!/bin/bash

API_URL="https://txopela-api.onrender.com/api"

echo "1. Testando Health..."
curl -s $API_URL/health/ | jq

echo -e "\n2. Testando Chat..."
curl -s -X POST $API_URL/ai/chat/ \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"content": "Olá"}]}' | jq

echo -e "\n3. Testando Pontos..."
curl -s $API_URL/pontos/ | jq

echo -e "\n✅ Testes concluídos!"
```

---

## 📊 MONITORAMENTO

### Ver logs em tempo real:

**Render:**
1. Acesse https://dashboard.render.com
2. Selecione seu serviço
3. Clique em "Logs"

**Vercel:**
```bash
vercel logs [deployment-url]
```

---

## ⚡ TESTE DE PERFORMANCE

### Tempo de resposta:
```bash
curl -w "\nTempo total: %{time_total}s\n" \
  -o /dev/null -s \
  https://txopela-api.onrender.com/api/health/
```

### Teste de latência:
```bash
for i in {1..10}; do
  curl -w "Request $i: %{time_total}s\n" \
    -o /dev/null -s \
    https://txopela-api.onrender.com/api/health/
done
```

---

## 🐛 DEBUG

### Ver headers da resposta:
```bash
curl -I https://txopela-api.onrender.com/api/health/
```

### Ver request e response completos:
```bash
curl -v https://txopela-api.onrender.com/api/health/
```

### Salvar resposta em arquivo:
```bash
curl https://txopela-api.onrender.com/api/pontos/ > pontos.json
```

---

## ✅ CHECKLIST DE TESTES

- [ ] Health check retorna 200
- [ ] Chat AI responde corretamente
- [ ] Pontos turísticos são listados
- [ ] CORS está configurado
- [ ] Tempo de resposta < 2s
- [ ] Erros retornam status code correto
- [ ] Headers de segurança estão presentes
- [ ] SSL/HTTPS está funcionando

---

## 🎉 RESULTADO ESPERADO

Todos os testes devem retornar:
- Status code 200 (ou apropriado)
- Headers CORS corretos
- Resposta JSON válida
- Tempo de resposta aceitável

Se algum teste falhar, verifique:
1. Logs no Render Dashboard
2. Variáveis de ambiente
3. Configuração de CORS
4. Conexão com MongoDB
