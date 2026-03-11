# Deploy no VPS - Txopela Tour

## 📋 Pré-requisitos do VPS

### 1. Sistema Operacional
- Ubuntu 20.04/22.04 LTS
- 2GB RAM mínimo (4GB recomendado)
- 20GB SSD
- IPv4 público

### 2. Dependências a Instalar
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y python3-pip python3-venv nginx git curl
sudo apt install -y postgresql postgresql-contrib  # Ou MySQL
sudo apt install -y redis-server
sudo apt install -y certbot python3-certbot-nginx

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalações
python3 --version
node --version
npm --version
nginx -v
```

## 🚀 Configuração do VPS

### 1. Criar Usuário para Aplicação
```bash
# Criar usuário
sudo adduser txopela
sudo usermod -aG sudo txopela

# Logar como usuário txopela
su - txopela
```

### 2. Clonar Repositório
```bash
cd /home/txopela
git clone https://github.com/seu-usuario/txopela-tour.git
cd txopela-tour
```

### 3. Configurar Backend
```bash
cd backend

# Ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Dependências
pip install -r requirements.txt
pip install gunicorn psycopg2-binary

# Configurar .env
cp .env.example .env
nano .env  # Editar com suas configurações

# Migrações
python manage.py makemigrations
python manage.py migrate

# Coletar estáticos
python manage.py collectstatic --noinput

# Criar superusuário
python manage.py createsuperuser
```

### 4. Configurar Business App
```bash
cd ../business-app

# Dependências
npm install --production

# Build
npm run build
```

### 5. Configurar Client App
```bash
cd ../frontend-vite

# Dependências
npm install --production

# Build
npm run build
```

## 🔧 Configuração do Nginx

### 1. Criar Configuração
```bash
sudo nano /etc/nginx/sites-available/txopela
```

### 2. Configuração Nginx
```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    
    # Logs
    access_log /var/log/nginx/txopela-access.log;
    error_log /var/log/nginx/txopela-error.log;
    
    # Client App
    location / {
        root /home/txopela/txopela-tour/frontend-vite/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Business App
    location /business {
        alias /home/txopela/txopela-tour/business-app/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Django API
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 75s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
    
    # Django Admin
    location /admin {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files
    location /static {
        alias /home/txopela/txopela-tour/backend/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Media files
    location /media {
        alias /home/txopela/txopela-tour/backend/media;
        expires 1y;
        add_header Cache-Control "public, immutable";
        client_max_body_size 100M;
    }
}
```

### 3. Ativar Site
```bash
sudo ln -s /etc/nginx/sites-available/txopela /etc/nginx/sites-enabled/
sudo nginx -t  # Testar configuração
sudo systemctl restart nginx
```

## 🚀 Configurar Gunicorn (Backend)

### 1. Criar Service do Systemd
```bash
sudo nano /etc/systemd/system/txopela.service
```

### 2. Configuração do Service
```ini
[Unit]
Description=Txopela Tour Django Application
After=network.target

[Service]
User=txopela
Group=www-data
WorkingDirectory=/home/txopela/txopela-tour/backend
Environment="PATH=/home/txopela/txopela-tour/backend/venv/bin"
ExecStart=/home/txopela/txopela-tour/backend/venv/bin/gunicorn \
    --workers 3 \
    --bind 127.0.0.1:8000 \
    --access-logfile /var/log/gunicorn/access.log \
    --error-logfile /var/log/gunicorn/error.log \
    txopela_backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

### 3. Iniciar Service
```bash
# Criar diretório de logs
sudo mkdir -p /var/log/gunicorn
sudo chown txopela:www-data /var/log/gunicorn

# Recarregar systemd
sudo systemctl daemon-reload

# Iniciar serviço
sudo systemctl start txopela
sudo systemctl enable txopela

# Verificar status
sudo systemctl status txopela
```

## 🔐 Configurar SSL (HTTPS)

### 1. Obter Certificado Let's Encrypt
```bash
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

### 2. Renovar Automaticamente
```bash
# Testar renovação
sudo certbot renew --dry-run

# Agendar renovação automática
sudo crontab -e
# Adicionar linha:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoramento

### 1. Logs
```bash
# Nginx logs
sudo tail -f /var/log/nginx/txopela-access.log
sudo tail -f /var/log/nginx/txopela-error.log

# Gunicorn logs
sudo tail -f /var/log/gunicorn/access.log
sudo tail -f /var/log/gunicorn/error.log

# Django logs
sudo journalctl -u txopela -f
```

### 2. Status dos Serviços
```bash
# Verificar status
sudo systemctl status nginx
sudo systemctl status txopela
sudo systemctl status postgresql  # ou mysql
sudo systemctl status redis

# Reiniciar serviços
sudo systemctl restart nginx
sudo systemctl restart txopela
```

## 🔄 Deploy Automático

### 1. Script de Deploy
```bash
nano /home/txopela/deploy.sh
```

```bash
#!/bin/bash
echo "Iniciando deploy do Txopela Tour..."

# Atualizar código
cd /home/txopela/txopela-tour
git pull origin main

# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
deactivate

# Business App
cd ../business-app
npm install --production
npm run build

# Client App
cd ../frontend-vite
npm install --production
npm run build

# Reiniciar serviços
sudo systemctl restart txopela
sudo systemctl reload nginx

echo "Deploy concluído!"
```

### 2. Tornar Executável
```bash
chmod +x /home/txopela/deploy.sh
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Erro 502 Bad Gateway
```bash
# Verificar Gunicorn
sudo systemctl status txopela
sudo journalctl -u txopela -f

# Verificar portas
sudo netstat -tlnp | grep 8000
```

#### 2. Erro de Permissão
```bash
# Corrigir permissões
sudo chown -R txopela:www-data /home/txopela/txopela-tour
sudo chmod -R 755 /home/txopela/txopela-tour
```

#### 3. Banco de Dados
```bash
# PostgreSQL
sudo -u postgres psql
# Criar database
CREATE DATABASE txopela;
CREATE USER txopela_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE txopela TO txopela_user;
\q
```

#### 4. SSL não funciona
```bash
# Verificar certificado
sudo certbot certificates
# Renovar
sudo certbot renew --force-renewal
```

## 📈 Otimizações

### 1. Otimizar Nginx
```bash
sudo nano /etc/nginx/nginx.conf
```
```nginx
# Adicionar no http block
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### 2. Otimizar Gunicorn
```bash
sudo nano /etc/systemd/system/txopela.service
```
```ini
# Ajustar workers baseado em CPU
--workers $((2 * $(nproc) + 1))
```

### 3. Cache Redis
```bash
# Instalar Redis
sudo apt install redis-server

# Configurar Django para usar Redis
# Adicionar em settings.py
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
```

## 🔧 Backup

### 1. Script de Backup
```bash
nano /home/txopela/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/txopela/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar diretório
mkdir -p $BACKUP_DIR

# Backup do banco de dados
sudo -u postgres pg_dump txopela > $BACKUP_DIR/txopela_db_$DATE.sql

# Backup de arquivos
tar -czf $BACKUP_DIR/txopela_files_$DATE.tar.gz \
    /home/txopela/txopela-tour/backend/media \
    /home/txopela/txopela-tour/backend/.env

# Manter apenas últimos 7 backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup concluído: $BACKUP_DIR/txopela_$DATE"
```

### 2. Agendar Backup Diário
```bash
sudo crontab -e
# Adicionar linha:
0 2 * * * /home/txopela/backup.sh
```

## 🎯 Verificação Final

### Testar Tudo
```bash
# 1. Testar API
curl http://localhost:8000/api/health/

# 2. Testar Client App
curl -I http://localhost/

# 3. Testar Business App
curl -I http://localhost/business

# 4. Testar SSL
curl -I https://seu-dominio.com
```

### Monitorar Recursos
```bash
# CPU e Memória
htop

# Rede
iftop

# Discos
df -h
```

## 📞 Suporte

### Logs Importantes
- `/var/log/nginx/` - Logs do Nginx
- `/var/log/gunicorn/` - Logs do Gunicorn
- `/var/log/syslog` - Logs do sistema
- `journalctl -u txopela` - Logs da aplicação

### Comandos Úteis
```bash
# Reiniciar tudo
sudo systemctl restart nginx txopela

# Verificar erros
sudo tail -f /var/log/nginx/error.log

# Limpar cache
sudo systemctl restart redis
```

---

**Pronto!** Sua plataforma Txopela Tour está configurada no VPS e pronta para produção. 🚀

**URLs:**
- Client App: https://seu-dominio.com
- Business App: https://seu-dominio.com/business
- API: https://seu-dominio.com/api
- Admin: https://seu-dominio.com/admin

**Credenciais padrão admin:**
- Usuário: admin
- Email: admin@txopela.com
- Senha: (definida durante instalação)