# Txopela Business App

Aplicação para donos de negócios (restaurantes, hotéis, guias turísticos, etc.) gerenciarem seus perfis na plataforma Txopela Tour.

## Funcionalidades

- **Dashboard**: Visualize estatísticas e atividades do seu negócio
- **Localização**: Marque no mapa a localização do seu estabelecimento
- **Mensagens**: Receba e responda mensagens de clientes
- **Posts**: Crie promoções, eventos e notícias que aparecem no app do cliente
- **Perfil**: Gerencie informações do negócio

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5174

## Configuração

Crie um arquivo `.env` com:

```
VITE_API_URL=http://localhost:8000/api
```

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Leaflet (mapas)
- Axios

## Estrutura

```
src/
├── components/     # Componentes reutilizáveis
├── context/        # Context API (BusinessContext)
├── pages/          # Páginas da aplicação
├── services/       # Serviços de API
├── App.tsx         # Componente principal
└── main.tsx        # Entry point
```

## Integração com Backend

Esta aplicação consome a API Django do backend. Certifique-se de que o backend está rodando em `http://localhost:8000`.

### Endpoints Necessários (a serem implementados no backend):

- `POST /api/business/register/` - Cadastro de negócio
- `POST /api/business/login/` - Login
- `GET /api/business/profile/` - Obter perfil
- `PUT /api/business/profile/` - Atualizar perfil
- `PUT /api/business/location/` - Atualizar localização
- `GET /api/business/messages/` - Listar mensagens
- `PUT /api/business/messages/:id/read/` - Marcar como lida
- `POST /api/business/messages/:id/reply/` - Responder mensagem
- `GET /api/business/posts/` - Listar posts
- `POST /api/business/posts/` - Criar post
- `PUT /api/business/posts/:id/` - Atualizar post
- `DELETE /api/business/posts/:id/` - Excluir post
- `PUT /api/business/posts/:id/toggle/` - Ativar/desativar post
- `GET /api/business/stats/overview/` - Estatísticas gerais
- `GET /api/business/stats/views/` - Visualizações por período
