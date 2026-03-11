# 📱 Plano: Aplicação de Negócios (Business App)

## 🎯 Objetivo
Criar uma aplicação separada para donos de negócios (restaurantes, hotéis, etc.) gerenciarem seus estabelecimentos na plataforma Txopela Tour.

## 🏗️ Arquitetura

### Frontend (business-app)
- **Framework:** React 18 + TypeScript + Vite
- **Estilo:** Tailwind CSS
- **Mapas:** Leaflet
- **Autenticação:** JWT (tipo: business)
- **Porta:** 5175

### Backend (Django)
Expandir API existente com:
- Modelo de conta Business
- Endpoints para negócios
- Sistema de mensagens
- Posts/publicações
- Atualização de localização

## 📊 Diferenças: Cliente vs Negócio

| Recurso | Cliente | Negócio |
|---------|---------|---------|
| **Autenticação** | user_type: 'client' | user_type: 'business' |
| **Visualizar pontos** | ✅ Sim | ✅ Sim |
| **Criar pontos** | ❌ Não | ✅ Sim (próprio negócio) |
| **Editar localização** | ❌ Não | ✅ Sim (próprio negócio) |
| **Receber mensagens** | ✅ Sim | ✅ Sim |
| **Criar posts** | ❌ Não | ✅ Sim |
| **Dashboard** | ❌ Não | ✅ Sim (analytics) |

## 🔐 Sistema de Autenticação

### Modelo User (expandido)
```python
class User:
    username: str
    email: str
    password: str (hash)
    user_type: 'client' | 'business' | 'admin'
    first_name: str
    last_name: str
    created_at: datetime
```

### Modelo BusinessProfile
```python
class BusinessProfile:
    user_id: ObjectId  # Referência ao User
    business_name: str
    business_type: str  # 'restaurant', 'hotel', 'tour', 'shop'
    description: str
    location: {
        type: 'Point',
        coordinates: [lng, lat]
    }
    address: str
    phone: str
    email: str
    website: str
    logo_url: str
    cover_image_url: str
    opening_hours: str
    price_range: str
    amenities: [str]
    verified: bool
    created_at: datetime
    updated_at: datetime
```

## 📱 Funcionalidades Business App

### 1. Autenticação
- [x] Registro de negócio
- [x] Login
- [x] Logout
- [x] Recuperação de senha

### 2. Dashboard
- [ ] Visão geral do negócio
- [ ] Estatísticas de visualizações
- [ ] Avaliações recentes
- [ ] Mensagens não lidas

### 3. Perfil do Negócio
- [ ] Editar informações básicas
- [ ] Upload de logo e capa
- [ ] Definir localização no mapa
- [ ] Horários de funcionamento
- [ ] Fotos do estabelecimento
- [ ] Amenidades/serviços

### 4. Localização
- [ ] Mapa interativo para definir localização
- [ ] Atualizar coordenadas
- [ ] Visualizar no mapa do cliente

### 5. Posts/Publicações
- [ ] Criar posts com fotos
- [ ] Editar posts
- [ ] Deletar posts
- [ ] Ver engajamento

### 6. Mensagens
- [ ] Inbox de mensagens
- [ ] Responder clientes
- [ ] Notificações

### 7. Avaliações
- [ ] Ver todas as avaliações
- [ ] Responder avaliações
- [ ] Estatísticas de rating

### 8. Configurações
- [ ] Alterar senha
- [ ] Notificações
- [ ] Privacidade
- [ ] Deletar conta

## 🔌 Endpoints da API

### Autenticação
```
POST /api/auth/register/business/  - Registrar negócio
POST /api/auth/login/              - Login (client ou business)
GET  /api/auth/me/                 - Dados do usuário logado
```

### Business Profile
```
GET    /api/business/profile/           - Meu perfil
PATCH  /api/business/profile/           - Atualizar perfil
POST   /api/business/profile/logo/      - Upload logo
POST   /api/business/profile/cover/     - Upload capa
PATCH  /api/business/location/          - Atualizar localização
```

### Posts
```
GET    /api/business/posts/             - Meus posts
POST   /api/business/posts/             - Criar post
PATCH  /api/business/posts/:id/         - Editar post
DELETE /api/business/posts/:id/     /
─ pages  ├─sx
│ d.t─ ImageUploa
│   │   └─ker.tsxtionPic  ├── Loca│   ebar.tsx
│ │   ├── Sidar.tsx
│   │   ├── Navbx
│   ─ Layout.ts  ├─nts/
│   │ mpone├── cosrc/
│   
├── /ublic/
├── ps-app
businesjeto

```ra do Protrutu📁 Es# 
#```
 negócio
ísticas dostat       - Es/  iclyt/anassapi/busine
GET    /ytics
```## Anal`

#iação
``onder avalply/ - Resp:id/ress/reviews/usineST   /api/baliações
POnhas av    - Mi   ws/    siness/revie    /api/bues
```
GETaçõ
### Avaliida
```
omo l - Marcar c        /read/ s/:idssageapi/meH  /PATCa conversa
Detalhes d -          d/     /:igessamespi/
GET    /aagemr mensEnvia-                    messages/ST   /api/ensagens
POs m Minha          -        ages/ /api/mess
GET    gens
```
### Mensa```
d imagem
- Uploage/   osts/:id/imainess/p /api/busPOST  post
Deletar  -    