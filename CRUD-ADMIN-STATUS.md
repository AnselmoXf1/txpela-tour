# Status do CRUD Admin - Txopela Tour

## ✅ CRUD Completo e Funcional

### Backend (Django + MongoDB + Cloudinary)

#### Endpoints Disponíveis:

**CREATE (Criar Ponto)**
- Endpoint: `POST /admin/pontos/create/`
- Autenticação: Requerida (Admin)
- Dados: FormData com imagens
- Armazenamento:
  - Dados → MongoDB Atlas
  - Imagens → Cloudinary

**READ (Listar/Buscar Pontos)**
- `GET /pontos-turisticos/` - Lista todos
- `GET /pontos-turisticos/{id}/` - Detalhes de um ponto
- `GET /pontos-turisticos/search/?q=termo` - Busca por texto
- `GET /pontos-turisticos/stats/` - Estatísticas

**UPDATE (Atualizar Ponto)**
- Endpoint: `PATCH /pontos-turisticos/{id}/update/`
- Autenticação: Requerida (Admin)
- Atualiza: nome, descrição, categoria, localização, preço, horário, contato
- Dados → MongoDB Atlas

**DELETE (Deletar Ponto)**
- Endpoint: `DELETE /pontos-turisticos/{id}/delete/`
- Autenticação: Requerida (Admin)
- Remove:
  - Dados do MongoDB
  - Imagens do Cloudinary

#### Gerenciamento de Imagens:

**Upload de Imagem**
- Endpoint: `POST /pontos-turisticos/{id}/upload-image/`
- Autenticação: Requerida (Admin)
- Aceita: FormData com campo 'image'
- Armazena em: Cloudinary (pasta txopela-tour/pontos)
- Retorna: { url, public_id, alt }

**Deletar Imagem**
- Endpoint: `DELETE /pontos-turisticos/{id}/delete-image/{public_id}/`
- Autenticação: Requerida (Admin)
- Remove do Cloudinary e MongoDB

### Frontend Admin (React + TypeScript + Vite)

#### Páginas Implementadas:

1. **Dashboard** (`/`)
   - Estatísticas gerais
   - Visão geral dos pontos

2. **Lista de Pontos** (`/points`)
   - Tabela com todos os pontos
   - Ações: Editar dados, Editar fotos, Deletar
   - Botão para criar novo ponto

3. **Criar Ponto** (`/points/create`)
   - Formulário completo
   - Upload múltiplo de imagens
   - Preview das imagens
   - Validação de campos

4. **Editar Ponto** (`/points/edit/:id`)
   - Formulário pré-preenchido
   - Atualização de dados
   - Link para editar fotos separadamente

5. **Modal de Edição de Fotos**
   - Upload de novas imagens
   - Deletar imagens existentes
   - Reordenar imagens (drag & drop)
   - Definir imagem principal

#### Funcionalidades:

✅ Autenticação JWT
✅ Upload de múltiplas imagens
✅ Preview de imagens antes do upload
✅ Drag & drop para reordenar fotos
✅ Definir foto principal
✅ Deletar fotos individuais
✅ Formulários com validação
✅ Loading states
✅ Mensagens de sucesso/erro
✅ Navegação entre páginas

### Configuração

#### Variáveis de Ambiente (.env):

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=txopito_ia_db

# Cloudinary
CLOUDINARY_CLOUD_NAME=dozv8vbuc
CLOUDINARY_API_KEY=466684533682764
CLOUDINARY_API_SECRET=sr7corAilOWbuoowREg5cWW67G0

# Django
SECRET_KEY=...
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Estrutura de Dados (MongoDB)

```javascript
{
  "_id": ObjectId,
  "nome": "Nome do Ponto",
  "descricao": "Descrição detalhada",
  "categoria": "praia|restaurante|hotel|pousada|atracao|mergulho|cultura|natureza",
  "localizacao": {
    "type": "Point",
    "coordinates": [longitude, latitude]  // GeoJSON
  },
  "imagens": [
    {
      "url": "https://res.cloudinary.com/...",
      "public_id": "txopela-tour/pontos/...",
      "alt": "Descrição da imagem"
    }
  ],
  "reviews": [...],
  "preco_medio": 150.00,
  "horario_funcionamento": "Seg-Dom: 8h-18h",
  "contato": "(11) 99999-9999"
}
```

## Como Usar

### 1. Iniciar Backend:
```bash
cd backend
python manage.py runserver
```

### 2. Iniciar Admin App:
```bash
cd admin-app
npm run dev
```

### 3. Acessar:
- Admin: http://localhost:5173
- Login: Use credenciais de admin criadas

### 4. Operações:

**Criar Ponto:**
1. Clique em "Adicionar Ponto"
2. Preencha o formulário
3. Adicione pelo menos 1 imagem
4. Clique em "Criar Ponto Turístico"
5. Imagens vão para Cloudinary
6. Dados vão para MongoDB

**Editar Dados:**
1. Na lista, clique no ícone de edição (lápis azul)
2. Modifique os campos desejados
3. Clique em "Salvar Alterações"
4. Dados atualizados no MongoDB

**Editar Fotos:**
1. Na lista, clique no ícone de imagem (roxo)
2. Arraste novas fotos ou clique para selecionar
3. Reordene arrastando as imagens
4. Delete fotos clicando no ícone de lixeira
5. Defina foto principal clicando na estrela
6. Imagens gerenciadas no Cloudinary

**Deletar Ponto:**
1. Na lista, clique no ícone de lixeira (vermelho)
2. Confirme a exclusão
3. Dados removidos do MongoDB
4. Imagens removidas do Cloudinary

## Testes

Execute o script de teste:
```bash
TEST-ADMIN-CRUD.bat
```

Verifica:
- ✅ Backend funcionando
- ✅ MongoDB conectado
- ✅ Cloudinary configurado
- ✅ Admin app pronto

## Segurança

- ✅ Autenticação JWT obrigatória
- ✅ Apenas admins podem criar/editar/deletar
- ✅ Validação de dados no backend
- ✅ CORS configurado
- ✅ Imagens otimizadas no upload

## Próximos Passos (Opcional)

- [ ] Adicionar crop de imagens
- [ ] Adicionar filtros na listagem
- [ ] Adicionar paginação
- [ ] Adicionar busca avançada
- [ ] Adicionar bulk operations
- [ ] Adicionar histórico de alterações
