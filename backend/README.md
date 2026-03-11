# Txopela Tour - Backend

Backend da plataforma Txopela Tour construído com Django 5+ e MongoDB.

## Instalação

1. Crie um ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente no `.env`:
- SECRET_KEY
- MONGODB_URI (MongoDB Atlas)
- GEMINI_API_KEY (Google Gemini)
- CLOUDINARY_* (Cloudinary)

## Migrações

```bash
python manage.py migrate
```

## Criar Superusuário

```bash
python manage.py createsuperuser
```

## Desenvolvimento

```bash
python manage.py runserver
```

Acesse: http://localhost:8000

## Estrutura

```
backend/
├── txopela_backend/      # Configurações Django
├── pontos_turisticos/    # App de pontos turísticos
├── ai_service/           # Integração com Gemini AI
└── authentication/       # Autenticação JWT
```

## Endpoints da API

### Pontos Turísticos
- GET `/api/pontos-turisticos/` - Lista todos
- GET `/api/pontos-turisticos/{id}/` - Detalhes
- GET `/api/pontos-turisticos/search/?q=query` - Busca
- GET `/api/pontos-turisticos/nearby/?lat=X&lng=Y` - Próximos

### IA
- POST `/api/ai/chat/` - Chat com assistente
- POST `/api/ai/recommendations/` - Recomendações

### Autenticação
- POST `/api/auth/register/` - Registro
- POST `/api/auth/login/` - Login

## MongoDB Schema

### pontos_turisticos
```json
{
  "nome": "string",
  "descricao": "string",
  "categoria": "string",
  "localizacao": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  },
  "imagens": [
    {
      "url": "string",
      "public_id": "string",
      "alt": "string"
    }
  ],
  "reviews": [
    {
      "usuario": "string",
      "rating": "number",
      "comentario": "string",
      "data": "datetime"
    }
  ],
  "preco_medio": "number",
  "horario_funcionamento": "string",
  "contato": "string"
}
```
