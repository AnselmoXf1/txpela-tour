# Solução Completa - Business App

## Problemas Corrigidos

1. ✅ Erro 500 → Modelo User customizado
2. ✅ CSS não carrega → Tailwind v3 configurado
3. ⏳ Erro 400 no cadastro → Debug adicionado

## Passo a Passo para Resolver

### 1. Preparar Backend

```bash
cd backend
venv\Scripts\activate

# Aplicar migrações
python manage.py makemigrations business_panel
python manage.py migrate

# Iniciar servidor
python manage.py runserver
```

**Deixe este terminal aberto e observe os logs!**

### 2. Preparar Business App

```bash
cd business-app

# Reinstalar dependências (Tailwind correto)
rmdir /s /q node_modules
del package-lock.json
npm install

# Iniciar app
npm run dev
```

Acesse: http://localhost:5174

### 3. Testar Cadastro

1. Vá em: http://localhost:5174/register

2. Preencha:
   - Nome: Restaurante Teste
   - Categoria: Restaurante
   - Email: teste@restaurante.com
   - Telefone: +244 923 456 789
   - Senha: senha123
   - Descrição: Melhor restaurante da cidade

3. Clique em "Cadastrar"

4. **Observe:**
   - Terminal do backend: deve mostrar "Dados recebidos: {...}"
   - Browser console (F12): deve mostrar erro detalhado se houver

### 4. Se Der Erro 400

**No terminal do backend, você verá:**
```
Dados recebidos: {...}
Erros de validação: {...}
```

**Erros comuns:**

#### A) Email já existe
```
Erros de validação: {'email': ['Este email já está cadastrado']}
```

**Solução:** Use outro email ou delete:
```bash
python manage.py shell
from authentication.models import User
User.objects.filter(email='teste@restaurante.com').delete()
exit()
```

#### B) Categoria inválida
```
Erros de validação: {'category': ['Escolha inválida']}
```

**Solução:** Verificar se categoria está correta (restaurant, hotel, tour_guide, shop, service)

#### C) Campo obrigatório faltando
```
Erros de validação: {'description': ['Este campo é obrigatório']}
```

**Solução:** Preencher todos os campos

### 5. Teste Direto (sem frontend)

Execute:
```bash
TEST-BUSINESS-REGISTER.bat
```

Isso testa o endpoint diretamente.

### 6. Verificar CSS

Se o CSS não carregar:

1. Pare o servidor (Ctrl+C)
2. Delete node_modules e package-lock.json
3. Execute: `npm install`
4. Execute: `npm run dev`

O CSS deve aparecer:
- Fundo gradiente azul/roxo
- Card branco centralizado
- Botão azul

## Scripts Úteis

### INICIAR-TUDO.bat
Prepara backend e apps

### TEST-BUSINESS-REGISTER.bat
Testa endpoint de cadastro

### business-app/SETUP.bat
Reinstala dependências do Business App

### backend/migrate-business.bat
Aplica migrações do business_panel

## Estrutura de Teste Completa

```
Terminal 1 - Backend:
cd backend
venv\Scripts\activate
python manage.py runserver
→ Observe os logs aqui!

Terminal 2 - Business App:
cd business-app
npm run dev
→ http://localhost:5174

Terminal 3 - Client App (opcional):
cd frontend-vite
npm run dev
→ http://localhost:5173
```

## Fluxo Esperado (Sucesso)

1. **Cadastro:**
   - Preencher formulário
   - Clicar "Cadastrar"
   - Ver "Cadastro realizado com sucesso!"
   - Redirecionar para /login

2. **Login:**
   - Email: teste@restaurante.com
   - Senha: senha123
   - Clicar "Entrar"
   - Redirecionar para Dashboard

3. **Dashboard:**
   - Ver sidebar azul
   - Ver cards de estatísticas
   - Navegar entre páginas

## Verificação Final

### Backend está OK se:
- [ ] Servidor roda sem erros
- [ ] Migrações aplicadas
- [ ] Mostra "Dados recebidos" no console ao cadastrar

### Business App está OK se:
- [ ] CSS carrega (gradiente, cores)
- [ ] Formulário aparece estilizado
- [ ] Botões têm cor azul
- [ ] Layout responsivo

### Cadastro está OK se:
- [ ] Retorna status 201
- [ ] Cria usuário no banco
- [ ] Cria business no banco
- [ ] Redireciona para login

## Comandos de Emergência

### Resetar tudo:
```bash
# Backend
cd backend
del db.sqlite3
python manage.py migrate
python manage.py createsuperuser

# Business App
cd business-app
rmdir /s /q node_modules
npm install
```

### Ver usuários cadastrados:
```bash
cd backend
python manage.py shell
from authentication.models import User
User.objects.all()
exit()
```

### Ver negócios cadastrados:
```bash
cd backend
python manage.py shell
from business_panel.models import Business
Business.objects.all()
exit()
```

## Contato de Suporte

Se o erro persistir:
1. Copie os logs do backend
2. Copie o erro do browser console
3. Verifique DEBUG-BUSINESS-REGISTER.md
