# Solução Rápida - Business App

## Problemas Atuais

1. ❌ Erro 400 no cadastro
2. ❌ Erro 500 no login
3. ❌ CSS não carrega

## Solução em 5 Passos

### Passo 1: Limpar e Recriar Banco de Dados

```bash
cd backend
del db.sqlite3
python manage.py migrate
```

### Passo 2: Reinstalar Business App

```bash
cd business-app
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Passo 3: Iniciar Backend com Logs

```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

**Deixe este terminal aberto para ver os logs!**

### Passo 4: Iniciar Business App

Em outro terminal:

```bash
cd business-app
npm run dev
```

### Passo 5: Testar

1. Acesse: http://localhost:5174/register
2. Preencha o formulário
3. Veja os logs no terminal do backend
4. Se der erro, copie a mensagem completa

## Teste Automatizado

Execute este script para testar a API diretamente:

```bash
TEST-BUSINESS-FLOW.bat
```

Isso vai:
- Cadastrar um negócio de teste
- Fazer login
- Acessar o perfil
- Mostrar onde está o erro (se houver)

## Verificação Rápida

### Backend está OK?
- [ ] Terminal mostra "Starting development server"
- [ ] Acessa http://localhost:8000/admin sem erro
- [ ] Não há erros de migração

### Business App está OK?
- [ ] Terminal mostra "Local: http://localhost:5174"
- [ ] Página carrega com CSS (gradiente azul/roxo)
- [ ] Formulário está estilizado

### Banco de Dados está OK?
- [ ] Arquivo `db.sqlite3` existe
- [ ] Migrações aplicadas (`python manage.py migrate`)
- [ ] Tabela `business_panel_business` existe

## Erros Comuns e Soluções

### Erro: "No such table: business_panel_business"
**Solução:**
```bash
cd backend
python manage.py makemigrations business_panel
python manage.py migrate
```

### Erro: "Email já cadastrado"
**Solução:**
```bash
cd backend
python manage.py shell
```
```python
from authentication.models import User
User.objects.filter(email='seu@email.com').delete()
exit()
```

### Erro: CSS não carrega (tudo azul)
**Solução:**
```bash
cd business-app
npm install tailwindcss@3.4.17 postcss autoprefixer
npm run dev
```

### Erro: CORS
**Solução:** Adicione em `backend/txopela_backend/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5174',
]
```

## Teste Manual Simples

### 1. Teste o Backend

Abra o navegador: http://localhost:8000/api/business/register/

Deve mostrar: "Method Not Allowed" (isso é OK, significa que o endpoint existe)

### 2. Teste com cURL

```bash
curl -X POST http://localhost:8000/api/business/register/ ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Teste\",\"email\":\"teste@test.com\",\"password\":\"123\",\"category\":\"restaurant\",\"phone\":\"123\",\"description\":\"Teste\"}"
```

### 3. Veja os Logs

No terminal do backend, você deve ver:
```
Dados recebidos: {'name': 'Teste', ...}
```

Se não aparecer nada, o problema é de CORS ou roteamento.

## Checklist Final

Antes de testar, verifique:

- [ ] Backend rodando (porta 8000)
- [ ] Business App rodando (porta 5174)
- [ ] Migrações aplicadas
- [ ] CORS configurado
- [ ] Tailwind instalado (v3.4.17)
- [ ] Terminal do backend aberto para ver logs
- [ ] Console do browser aberto (F12)

## Se Nada Funcionar

Recomeçe do zero:

```bash
# 1. Pare tudo (Ctrl+C em todos os terminais)

# 2. Limpe o backend
cd backend
del db.sqlite3
rmdir /s /q business_panel\migrations
python manage.py makemigrations business_panel
python manage.py migrate

# 3. Limpe o business-app
cd ..\business-app
rmdir /s /q node_modules
del package-lock.json
npm install

# 4. Inicie tudo novamente
# Terminal 1: cd backend && python manage.py runserver
# Terminal 2: cd business-app && npm run dev
```

## Contato para Suporte

Se o erro persistir, forneça:
1. Mensagem de erro completa do terminal do backend
2. Mensagem de erro do console do browser (F12)
3. Screenshot da tela
4. Resultado do `TEST-BUSINESS-FLOW.bat`
