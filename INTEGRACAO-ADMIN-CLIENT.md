# Integração Admin ↔ Client App

## ✅ Sincronização Completa

### Fluxo de Dados

```
ADMIN APP (Gerenciamento)
    ↓
BACKEND (Django + MongoDB + Cloudinary)
    ↓
CLIENT APP (Visualização)
```

## O que o Admin Faz

### 1. CREATE (Criar Ponto)
**Admin:** `/points/create`
- Formulário completo
- Upload de múltiplas imagens → Cloudinary
- Dados salvos → MongoDB

**Client vê:**
- ✅ Home: Novo ponto aparece no feed
- ✅ Explore: Novo ponto no mapa e lista
- ✅ PointDetail: Página completa do ponto

### 2. UPDATE (Atualizar Dados)
**Admin:** `/points/edit/:id`
- Edita: nome, descrição, categoria, localização, preço, horário, contato
- Atualiza → MongoDB

**Client vê:**
- ✅ Home: Dados atualizados no card
- ✅ Explore: Informações atualizadas
- ✅ PointDetail: Todos os dados novos

### 3. UPDATE (Editar Fotos)
**Admin:** Modal de edição de imagens
- Upload novas fotos → Cloudinary
- Deletar fotos → Remove do Cloudinary e MongoDB
- Reordenar fotos → Atualiza ordem no MongoDB
- Definir foto principal → Primeira imagem do array

**Client vê:**
- ✅ Home: Nova foto principal no card
- ✅ Explore: Foto atualizada no card e popup do mapa
- ✅ PointDetail: Galeria completa com todas as fotos

### 4. DELETE (Deletar Ponto)
**Admin:** Botão de deletar na lista
- Remove dados → MongoDB
- Remove todas as fotos → Cloudinary

**Client vê:**
- ✅ Home: Ponto removido do feed
- ✅ Explore: Ponto removido do mapa e lista
- ✅ PointDetail: Página não encontrada (404)

## Endpoints Compartilhados

### Backend API (Django)

```
GET  /api/pontos-turisticos/           → Lista todos (usado pelo client)
GET  /api/pontos-turisticos/:id/       → Detalhes (usado pelo client)
GET  /api/pontos-turisticos/search/    → Busca (usado pelo client)
GET  /api/pontos-turisticos/stats/     → Estatísticas (usado pelo admin)

POST   /admin/pontos/create/           → Criar (admin only)
PATCH  /pontos-turisticos/:id/update/  → Atualizar (admin only)
DELETE /pontos-turisticos/:id/delete/  → Deletar (admin only)

POST   /pontos-turisticos/:id/upload-image/        → Upload foto (admin only)
DELETE /pontos-turisticos/:id/delete-image/:id/    → Deletar foto (admin only)

POST /pontos-turisticos/:id/review/    → Adicionar review (client, autenticado)
```

## Estrutura de Dados (MongoDB)

```javascript
{
  "_id": "507f1f77bcf86cd799439011",
  "nome": "Praia do Tofo",
  "descricao": "Praia paradisíaca...",
  "categoria": "praia",
  "localizacao": {
    "type": "Point",
    "coordinates": [35.5500, -23.8500]  // [lng, lat]
  },
  "imagens": [
    {
      "url": "https://res.cloudinary.com/dozv8vbuc/image/upload/v1234/txopela-tour/pontos/abc123.jpg",
      "public_id": "txopela-tour/pontos/abc123",
      "alt": "Praia do Tofo"
    }
  ],
  "reviews": [
    {
      "usuario": "João Silva",
      "rating": 5,
      "comentario": "Lugar incrível!",
      "data": "2024-01-15T10:30:00Z"
    }
  ],
  "preco_medio": 150.00,
  "horario_funcionamento": "24h",
  "contato": "+258 84 123 4567"
}
```

## Como o Client Consome os Dados

### Home Page (`/`)
```typescript
// Carrega todos os pontos
const response = await pontosTuristicosService.getAll();
setPoints(response.data);

// Para cada ponto:
- Mostra imagens[0].url (foto principal)
- Exibe nome, descrição, categoria
- Calcula rating médio das reviews
- Conta número de reviews
```

### Explore Page (`/explore`)
```typescript
// Carrega todos os pontos
const response = await pontosTuristicosService.getAll();

// Lista lateral:
- Mostra cards com imagens[0].url
- Filtros por categoria
- Busca por texto

// Mapa:
- Usa localizacao.coordinates para posicionar markers
- Popup com imagens[0].url e dados básicos
```

### Point Detail Page (`/point/:id`)
```typescript
// Carrega ponto específico
const response = await pontosTuristicosService.getById(id);

// Exibe:
- Galeria completa: todas as imagens[]
- Dados: nome, descrição, categoria
- Info cards: horario_funcionamento, preco_medio, contato
- Mapa: localizacao.coordinates
- Reviews: lista completa de reviews[]
- Formulário para adicionar review (se autenticado)
```

## Testes de Integração

### Teste 1: Criar Ponto no Admin
1. Admin: Criar novo ponto "Praia X" com 3 fotos
2. Client Home: Verificar se "Praia X" aparece no feed
3. Client Explore: Verificar se "Praia X" aparece no mapa
4. Client Detail: Abrir página e ver 3 fotos na galeria

### Teste 2: Editar Dados no Admin
1. Admin: Mudar nome de "Praia X" para "Praia Y"
2. Admin: Mudar categoria de "praia" para "natureza"
3. Client: Recarregar e verificar mudanças em todas as páginas

### Teste 3: Editar Fotos no Admin
1. Admin: Adicionar 2 novas fotos
2. Admin: Deletar 1 foto antiga
3. Admin: Reordenar fotos (mudar principal)
4. Client: Verificar nova foto principal no feed
5. Client Detail: Verificar galeria com 4 fotos na nova ordem

### Teste 4: Deletar Ponto no Admin
1. Admin: Deletar "Praia Y"
2. Client Home: Verificar que não aparece mais
3. Client Explore: Verificar que não está no mapa
4. Client Detail: Tentar acessar URL → Mostrar "não encontrado"

### Teste 5: Reviews no Client
1. Client: Adicionar review com 5 estrelas
2. Admin: Ver estatísticas atualizadas
3. Client: Ver review na lista de avaliações

## Sincronização em Tempo Real

### Atualmente (Reload Manual)
- Client precisa recarregar página para ver mudanças
- Admin precisa recarregar lista após edições

### Melhorias Futuras (Opcional)
- WebSockets para updates em tempo real
- Polling automático a cada X segundos
- Notificações de mudanças

## Checklist de Verificação

### Backend
- [x] MongoDB conectado e funcionando
- [x] Cloudinary configurado
- [x] Endpoints de CRUD funcionando
- [x] Autenticação JWT para admin
- [x] CORS configurado para ambos os apps

### Admin App
- [x] Criar pontos com upload de imagens
- [x] Editar dados dos pontos
- [x] Editar fotos (upload, delete, reorder)
- [x] Deletar pontos
- [x] Ver estatísticas

### Client App
- [x] Listar todos os pontos (Home)
- [x] Buscar e filtrar pontos (Explore)
- [x] Ver detalhes completos (PointDetail)
- [x] Ver todas as fotos em galeria
- [x] Ver localização no mapa
- [x] Adicionar reviews
- [x] Ver reviews de outros usuários

### Dados
- [x] Imagens armazenadas no Cloudinary
- [x] Dados armazenados no MongoDB
- [x] Estrutura de dados consistente
- [x] Coordenadas GeoJSON corretas

## Comandos para Testar

### 1. Iniciar Backend
```bash
cd backend
python manage.py runserver
```

### 2. Iniciar Admin App
```bash
cd admin-app
npm run dev
# Acesse: http://localhost:5173
```

### 3. Iniciar Client App
```bash
cd frontend-vite
npm run dev
# Acesse: http://localhost:5174
```

### 4. Testar Fluxo Completo
```bash
# Execute o script de teste
TEST-INTEGRATION.bat
```

## Variáveis de Ambiente

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=dozv8vbuc
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### Admin App (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

### Client App (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

## Troubleshooting

### Problema: Client não mostra pontos criados no admin
**Solução:**
1. Verificar se backend está rodando
2. Verificar console do browser por erros de CORS
3. Verificar se VITE_API_URL está correto
4. Recarregar página do client

### Problema: Imagens não aparecem
**Solução:**
1. Verificar se Cloudinary está configurado no backend
2. Verificar se imagens foram realmente enviadas (ver MongoDB)
3. Verificar URLs das imagens no console
4. Verificar se imagens[0] existe

### Problema: Coordenadas erradas no mapa
**Solução:**
1. MongoDB usa [longitude, latitude]
2. Leaflet usa [latitude, longitude]
3. Verificar função getLatLng() no client
4. Verificar se coordenadas estão no formato correto

## Status Final

✅ **TUDO INTEGRADO E FUNCIONANDO**

- Admin cria/edita/deleta → Client mostra imediatamente (após reload)
- Fotos vão para Cloudinary → Client exibe URLs corretas
- Dados vão para MongoDB → Client busca e exibe
- Reviews no client → Aparecem para todos
- Estrutura de dados consistente em todo o sistema
