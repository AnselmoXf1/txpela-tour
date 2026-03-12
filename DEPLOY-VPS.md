# DEPLOY NO VPS - TXOPELA TOUR

## Informações do VPS
- IP: 75.119.133.19
- Sistema: Ubuntu/Debian (assumindo)

## 1. PREPARAÇÃO LOCAL

### 1.1. Commitar as alterações
```bash
# Adicionar arquivos modificados
git add .

# Commitar
git commit -m "Fix: API Gemini REST e configurações para deploy"

# Verificar status
git status
```

### 1.2. Configurar repositório remoto (se necessário)
```bash
# Verificar remotos
git remote -v

# Adicionar remote (se não existir)
git remote add origin [URL_DO_SEU_REPOSITORIO]
```

## 2. CONFIGURAÇÃO DO VPS

### 2.1. Conectar ao VPS
```bash
ssh root@75.119.133.19
# ou
ssh usuario@75.119.133.19
```

### 2.2. Instalar dependências no VPS
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Python e pip
sudo apt install python3 python3-pip python3-venv -y

# Instalar Node.js (para frontend)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Instalar Git
sudo apt install git -y

# Instalar Nginx
sudo apt install nginx -y

# Instalar PostgreSQL (opcional, se não usar SQLite)
sudo apt install postgresql postgresql-contrib -y

# Instalar supervisor para gerenciar processos
sudo apt install supervisor -y
```

### 2.3. Clonar o repositório
```bash
# Criar diretório para a aplicação
sudo mkdir -p /var/www/txopela
sudo chown -R $USER:$USER /var/www/txopela

# Clonar o repositório
cd /var/www/txopela
git clone [URL_DO_SEU_REPOSITORIO] .
```

## 3. CONFIGURAÇÃO DO BACKEND

### 3.1. Configurar ambiente Python
```bash
cd /var/www/txopela/backend

# Criar ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install --upgrade pip
pip install -r requirements.txt

# Instalar dependências adicionais (se necessário)
pip install gunicorn psycopg2-binary
```

### 3.2. Configurar variáveis de ambiente
```bash
# Copiar arquivo .env.example para .env
cp .env.example .env

# Editar o arquivo .env com suas configurações
nano .env
```

**Configurações importantes no .env:**
```env
SECRET_KEY=sua-chave-secreta-aqui
DEBUG=False
ALLOWED_HOSTS=75.119.133.19,localhost,127.0.0.1

# MongoDB Atlas (já configurado)
MONGODB_URI=mongodb+srv://txopito-ADMIN:txopitoAdmin12@cluster0.bt5at8j.mongodb.net/?appName=Cluster0
MONGODB_DB_NAME=txopito_ia_db

# Google Gemini AI
GEMINI_API_KEY=AIzaSyBeusp4cuMC709uuQ1ZfpQzdK4sdp6GP2Y

# Cloudinary
CLOUDINARY_CLOUD_NAME=dozv8vbuc
CLOUDINARY_API_KEY=466684533682764
CLOUDINARY_API_SECRET=sr7corAilOWbuoowREg5cWW67G0

# CORS
CORS_ALLOWED_ORIGINS=http://75.119.133.19,http://localhost:5173
```

### 3.3. Configurar banco de dados
```bash
# Aplicar migrações
python manage.py migrate

# Criar superusuário (opcional)
python manage.py createsuperuser

# Coletar arquivos estáticos
python manage.py collectstatic --noinput
```

## 4. CONFIGURAÇÃO DO FRONTEND

### 4.1. Frontend Vite (app cliente)
```bash
cd /var/www/txopela/frontend-vite

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env.production
# Editar .env.production com as configurações do VPS

# Build para produção
npm run build
```

### 4.2. Admin App
```bash
cd /var/www/txopela/admin-app

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env.production

# Build para produção
npm run build
```

### 4.3. Business App
```bash
cd /var/www/txopela/business-app

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env.production

# Build para produção
npm run build
```

## 5. CONFIGURAÇÃO DO NGINX

### 5.1. Criar configuração do Nginx
```bash
sudo nano /etc/nginx/sites-available/txopela
```

**Conteúdo do arquivo:**
```nginx
server {
    listen 80;
    server_name 75.119.133.19;

    # Frontend Vite (app cliente)
    location / {
        root /var/www/txopela/frontend-vite/dist;
        try_files $uri $uri/ /index.html;
    }

    # Admin App
    location /admin {
        alias /var/www/txopela/admin-app/dist;
        try_files $uri $uri/ /admin/index.html;
    }

    # Business App
    location /business {
        alias /var/www/txopela/business-app/dist;
        try_files $uri $uri/ /business/index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Arquivos estáticos do Django
    location /static {
        alias /var/www/txopela/backend/staticfiles;
    }

    # Media files
    location /media {
        alias /var/www/txopela/backend/media;
    }
}
```

### 5.2. Ativar site e testar configuração
```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/txopela /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

## 6. CONFIGURAÇÃO DO GUNICORN (BACKEND)

### 6.1. Criar serviço do Gunicorn
```bash
sudo nano /etc/systemd/system/txopela.service
```

**Conteúdo do arquivo:**
```ini
[Unit]
Description=Txopela Tour Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/txopela/backend
Environment="PATH=/var/www/txopela/backend/venv/bin"
ExecStart=/var/www/txopela/backend/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 txopela_backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

### 6.2. Iniciar e habilitar o serviço
```bash
# Recarregar systemd
sudo systemctl daemon-reload

# Iniciar serviço
sudo systemctl start txopela

# Habilitar para iniciar automaticamente
sudo systemctl enable txopela

# Verificar status
sudo systemctl status txopela
```

## 7. CONFIGURAÇÃO DO SSL (OPCIONAL)

### 7.1. Instalar Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 7.2. Obter certificado SSL
```bash
sudo certbot --nginx -d 75.119.133.19
```

## 8. TESTES FINAIS

### 8.1. Testar endpoints
```bash
# Testar API
curl http://75.119.133.19/api/ai/chat/ -X POST -H "Content-Type: application/json" -d '{"messages": [{"content": "Olá"}]}'

# Testar frontend
curl -I http://75.119.133.19/
```

### 8.2. Monitorar logs
```bash
# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs do Gunicorn
sudo journalctl -u txopela -f
```

## 9. COMANDOS ÚTEIS

### 9.1. Reiniciar serviços
```bash
# Reiniciar backend
sudo systemctl restart txopela

# Reiniciar Nginx
sudo systemctl restart nginx

# Reiniciar tudo
sudo systemctl restart txopela nginx
```

### 9.2. Atualizar aplicação
```bash
cd /var/www/txopela
git pull origin master

# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart txopela

# Frontends
cd ../frontend-vite
npm run build

cd ../admin-app
npm run build

cd ../business-app
npm run build
```

### 9.3. Backup
```bash
# Backup do banco de dados
cd /var/www/txopela/backend
source venv/bin/activate
python manage.py dumpdata > backup_$(date +%Y%m%d).json
```

## 10. SOLUÇÃO DE PROBLEMAS

### 10.1. Erros comuns

**API não responde:**
```bash
# Verificar se o Gunicorn está rodando
sudo systemctl status txopela

# Verificar porta 8000
sudo netstat -tlnp | grep 8000
```

**Frontend não carrega:**
```bash
# Verificar build
ls -la /var/www/txopela/frontend-vite/dist/

# Verificar permissões
sudo chown -R www-data:www-data /var/www/txopela
```

**Erros no Nginx:**
```bash
# Testar configuração
sudo nginx -t

# Verificar logs
sudo tail -f /var/log/nginx/error.log
```

### 10.2. Contatos
- **IP do VPS:** 75.119.133.19
- **Portas abertas:** 80 (HTTP), 443 (HTTPS), 22 (SSH)
- **URLs:**
  - App Cliente: http://75.119.133.19
  - Admin: http://75.119.133.19/admin
  - Business: http://75.119.133.19/business
  - API: http://75.119.133.19/api

---

**NOTA:** Substitua `[URL_DO_SEU_REPOSITORIO]` pela URL real do seu repositório Git (GitHub, GitLab, Bitbucket, etc.).