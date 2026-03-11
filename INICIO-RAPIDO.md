# 🚀 Início Rápido - Txopela Tour

## Setup Inicial (Apenas 1 vez)

```bash
SETUP-TUDO.bat
```

Isso vai:
- Instalar dependências do backend
- Instalar dependências do admin
- Instalar dependências do client
- Criar banco de dados
- Popular com dados de exemplo

## Iniciar o Sistema

```bash
START-ALL.bat
```

Ou iniciar cada parte separadamente:

### Backend (Python/Django)
```bash
cd backend
start-backend.bat
```
Ou manualmente:
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```
Acesse: http://localhost:8000

### Admin (React/Vite)
```bash
cd admin-app
npm run dev
```
Acesse: http://localhost:5173

### Client (React/Vite)
```bash
cd frontend-vite
npm run dev
```
Acesse: http://localhost:5174

## Login no Admin

**Credenciais padrão:**
- Username: `admin`
- Password: `admin123`

Se não funcionar, crie um novo admin:
```bash
cd backend
python create_admin.py
```

## Usar o Admin

### 1. Criar Ponto Turístico
1. Clique em "Adicionar Ponto"
2. Preencha o formulário
3. Adicione pelo menos 1 foto
4. Clique em "Criar Ponto Turístico"

### 2. Editar Dados
1. Na lista, clique no ícone de lápis (azul)
2. Modifique os campos
3. Clique em "Salvar Alterações"

### 3. Editar Fotos
1. Na lista, clique no ícone de imagem (roxo)
2. Arraste novas fotos ou clique para selecionar
3. Reordene arrastando as imagens
4. Delete fotos clicando no ícone de lixeira
5. Defina foto principal clicando na estrela

### 4. Deletar Ponto
1. Na lista, clique no ícone de lixeira (vermelho)
2. Confirme a exclusão

## Ver no Client

1. Abra http://localhost:5174
2. Veja os pontos no feed (Home)
3. Explore no mapa (Explore)
4. Clique em um ponto para ver detalhes
5. Adicione avaliações (precisa fazer login)

## Testar Integração

```bash
TEST-INTEGRATION.bat
```

## Problemas Comuns

### Backend não inicia
```bash
cd backend
pip install -r requirements.txt
```

### Admin/Client não inicia
```bash
cd admin-app  # ou frontend-vite
npm install
```

### Não vejo os pontos no client
1. Verifique se o backend está rodando
2. Abra o console do browser (F12)
3. Veja se há erros
4. Recarregue a página

### Imagens não aparecem
1. Verifique se o Cloudinary está configurado no backend/.env
2. Veja se as imagens foram enviadas (verifique no MongoDB)

## Arquivos Importantes

- `backend/.env` - Configurações do backend
- `admin-app/.env` - URL da API para admin
- `frontend-vite/.env` - URL da API para client

## Documentação Completa

- **README.md** - Documentação principal
- **CRUD-ADMIN-STATUS.md** - Status do CRUD
- **INTEGRACAO-ADMIN-CLIENT.md** - Como tudo se integra
- **RESUMO-FINAL.md** - Resumo completo do projeto

## Comandos Úteis

```bash
# Limpar projeto
CLEANUP-PROJECT.bat

# Testar CRUD
TEST-ADMIN-CRUD.bat

# Popular banco com dados
cd backend
python seed_pontos.py

# Criar novo admin
cd backend
python create_admin.py
```

## Pronto! 🎉

Agora você pode:
- ✅ Criar pontos turísticos no admin
- ✅ Ver no client
- ✅ Editar dados e fotos
- ✅ Deletar pontos
- ✅ Adicionar avaliações

Divirta-se! 🏝️
