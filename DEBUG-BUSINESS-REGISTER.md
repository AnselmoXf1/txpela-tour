# Debug - Erro 400 no Cadastro de Negócio

## Problema
Erro 400 (Bad Request) ao tentar cadastrar negócio no Business App.

## Passos para Debug

### 1. Verificar Backend

**Abra o terminal do backend e veja os logs:**

```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

Quando tentar cadastrar, você verá no console:
- "Dados recebidos: {...}"
- "Erros de validação: {...}" (se houver)

### 2. Testar Endpoint Diretamente

Execute o script de teste:

```bash
TEST-BUSINESS-REGISTER.bat
```

Isso vai testar o endpoint diretamente sem o frontend.

### 3. Verificar Erros Comuns

#### Erro: "category" inválida
**Solução:** Verificar se as categorias no frontend correspondem ao backend.

Backend aceita:
- `restaurant`
- `hotel`
- `tour_guide`
- `shop`
- `service`

#### Erro: Email já cadastrado
**Solução:** Use outro email ou delete o usuário existente:

```bash
cd backend
python manage.py shell
```

```python
from authentication.models import User
User.objects.filter(email='teste@restaurante.com').delete()
exit()
```

#### Erro: Campo obrigatório faltando
**Solução:** Verificar se todos os campos estão sendo enviados:
- name
- email
- password
- category
- phone
- description

### 4. Ver Erro Detalhado no Browser

1. Abra o Business App: http://localhost:5174/register
2. Abra DevTools (F12)
3. Vá na aba "Console"
4. Tente cadastrar
5. Veja o erro completo que será impresso

### 5. Verificar Migrações

Se o erro persistir, pode ser problema de migração:

```bash
cd backend
venv\Scripts\activate
python manage.py makemigrations business_panel
python manage.py migrate
```

### 6. Verificar CORS

Se o erro for de CORS, adicione no `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5174',
]
```

## Teste Manual via cURL

```bash
curl -X POST http://localhost:8000/api/business/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Restaurante Teste",
    "email": "teste@restaurante.com",
    "password": "senha123",
    "category": "restaurant",
    "phone": "+244 923 456 789",
    "description": "Melhor restaurante da cidade"
  }'
```

## Teste via Postman

1. Método: POST
2. URL: http://localhost:8000/api/business/register/
3. Headers: Content-Type: application/json
4. Body (raw JSON):
```json
{
  "name": "Restaurante Teste",
  "email": "teste@restaurante.com",
  "password": "senha123",
  "category": "restaurant",
  "phone": "+244 923 456 789",
  "description": "Melhor restaurante da cidade"
}
```

## Checklist de Verificação

- [ ] Backend está rodando (http://localhost:8000)
- [ ] Migrações aplicadas (`python manage.py migrate`)
- [ ] CORS configurado para porta 5174
- [ ] Todos os campos obrigatórios preenchidos
- [ ] Email não está duplicado
- [ ] Categoria é válida
- [ ] Console do backend mostra os dados recebidos
- [ ] Console do browser mostra erro detalhado

## Solução Rápida

Se nada funcionar, recrie o banco:

```bash
cd backend
del db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

Depois tente cadastrar novamente.

## Logs Esperados (Sucesso)

**Backend Console:**
```
Dados recebidos: {'name': 'Restaurante Teste', 'email': 'teste@restaurante.com', ...}
[03/Mar/2026 10:30:00] "POST /api/business/register/ HTTP/1.1" 201 85
```

**Browser Console:**
```
Cadastro realizado com sucesso!
```

**Browser Network:**
```
Status: 201 Created
Response: {"message": "Negócio cadastrado com sucesso", "business_id": 1}
```
