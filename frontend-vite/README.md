# Txopela Tour - Frontend (Vite + React)

Frontend da plataforma Txopela Tour construído com Vite, React e TypeScript.

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure a URL da API no `.env`:
```
API_URL=http://localhost:8000/api
```

## Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## Build para Produção

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
├── components/       # Componentes React
│   ├── Layout.tsx   # Layout principal com Navbar/Footer
│   └── ChatBot.tsx  # Widget de chat com IA
├── pages/           # Páginas da aplicação
│   ├── Home.tsx
│   ├── Explore.tsx
│   ├── PointDetail.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Services.tsx
├── context/         # Context API
│   └── AuthContext.tsx
├── App.tsx          # Componente principal
├── main.tsx         # Entry point
└── index.css        # Estilos globais
```

## Tecnologias

- React 19
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS 4
- Leaflet.js (mapas)
- Motion (animações)
- Lucide React (ícones)

## Funcionalidades

- Hero section com busca
- Exploração de pontos turísticos
- Mapa interativo com marcadores
- Sistema de autenticação
- Reviews e avaliações
- ChatBot com IA
- Design responsivo
