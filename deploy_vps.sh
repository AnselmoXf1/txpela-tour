#!/bin/bash

# Script de deploy para VPS - Txopela Tour
# Executar no VPS (Ubuntu/Debian)

echo "=== DEPLOY TXOPELA TOUR NO VPS ==="
echo ""

# 1. Atualizar sistema
echo "1. Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# 2. Instalar dependências do sistema
echo "2. Instalando dependências do sistema..."
sudo apt install -y git python3 python3-pip python3-venv nginx python3-venv nodejs npm postgresql postgresql-contrib

# 3. Criar diretório do projeto
echo "3. Criando diretório do projeto..."
sudo mkdir -p /var/www/txopela
sudo chown -R $USER:$USER /var/www/txopela
cd /var/www/txopela

# 4. Clonar repositório
echo "4. Clonando repositório..."
git clone https://github.com/AnselmoXf1/txpela-tour.git .
# Se for privado, use: git clone https://seu_token@github.com/AnselmoXf1/txpela-tour.git .

# 5. Configurar backend
echo "5. Configurando backend..."
cd backend

# Criar ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependências Python
pip install --upgrade pip
pip install -r requirements.txt

# Configurar variáveis de ambiente
if [ ! -f .env ]; then
    cp .env.example .env
    echo "ATENÇÃO: Configure as variáveis de ambiente no arquivo .env"
    echo "Edite o arquivo .env com suas configurações"
fi

# Aplicar migrações
python manage.py migrate

# Coletar arquivos estáticos
python manage.py collectstatic --noinput

# 6. Configurar frontend
echo "6. Configurando frontend..."
cd ../frontend-vite
npm install
npm run build

# 7. Configurar Nginx
echo "7. Configurando Nginx..."
sudo tee /etc/nginx/sites-available/txopela << 'EOF'
server {
    listen 80;
    server_name _;
    
    # Frontend
    location / {
        root /var/www/txopela/frontend-vite/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Admin
    location /admin/ {
        alias /var/www/txopela/admin-app/dist/;
        try_files $uri $uri/ /index.html;
    }
    
    # Business
    location /business/ {
        alias /var/www/txopela/business-app/dist/;
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Criar link simbólico
sudo ln -sf /etc/nginx/sites-available/txopela /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 8. Configurar serviço Gunicorn
echo "8. Configurando serviço Gunicorn..."
sudo tee /etc/systemd/system/txopela.service << 'EOF'
[Unit]
Description=Gunicorn instance for Txopela Tour
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/txopela/backend
Environment="PATH=/var/www/txopela/backend/venv/bin"
ExecStart=/var/www/txopela/backend/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:8000 txopela_backend.wsgi:application

[Install]
WantedBy=multi-user.target
EOF

# 9. Iniciar serviços
echo "9. Iniciando serviços..."
sudo systemctl daemon-reload
sudo systemctl start txopela
sudo systemctl enable txopela
sudo systemctl restart nginx

echo ""
echo "=== DEPLOY CONCLUÍDO ==="
echo "Acesse: http://$(curl -s ifconfig.me)"
echo ""
echo "Comandos úteis:"
echo "  Ver logs: sudo journalctl -u txopela -f"
echo "  Reiniciar: sudo systemctl restart txopela"
echo "  Logs Nginx: sudo tail -f /var/log/nginx/error.log"