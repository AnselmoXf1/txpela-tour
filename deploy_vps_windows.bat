@echo off
echo ========================================
echo   DEPLOY TXOPELA TOUR NO VPS - WINDOWS
echo ========================================
echo.
echo PASSO A PASSO PARA DEPLOY NO VPS:
echo.
echo 1. CONECTAR AO VPS:
echo    ssh root@75.119.133.19
echo    (ou ssh usuario@75.119.133.19)
echo.
echo 2. EXECUTAR OS COMANDOS NO VPS:
echo.
echo    # Atualizar sistema
echo    sudo apt update && sudo apt upgrade -y
echo.
echo    # Instalar dependencias
echo    sudo apt install -y git python3 python3-pip python3-venv nginx nodejs npm
echo.
echo    # Criar diretorio
echo    sudo mkdir -p /var/www/txopela
echo    sudo chown -R $USER:$USER /var/www/txopela
echo    cd /var/www/txopela
echo.
echo    # Clonar repositorio
echo    git clone https://github.com/AnselmoXf1/txpela-tour.git .
echo.
echo 3. CONFIGURAR BACKEND:
echo    cd backend
echo    python3 -m venv venv
echo    source venv/bin/activate
echo    pip install --upgrade pip
echo    pip install -r requirements.txt
echo    cp .env.example .env
echo    # EDITAR .env com suas configuracoes
echo    python manage.py migrate
echo    python manage.py collectstatic --noinput
echo.
echo 4. CONFIGURAR FRONTEND:
echo    cd ../frontend-vite
echo    npm install
echo    npm run build
echo.
echo 5. CONFIGURAR NGINX:
echo    sudo nano /etc/nginx/sites-available/txopela
echo.
echo    # Copiar esta configuracao:
echo    server {
echo        listen 80;
echo        server_name _;
echo        
echo        location / {
echo            root /var/www/txopela/frontend-vite/dist;
echo            try_files $uri $uri/ /index.html;
echo        }
echo        
echo        location /api/ {
echo            proxy_pass http://127.0.0.1:8000;
echo            proxy_set_header Host $host;
echo            proxy_set_header X-Real-IP $remote_addr;
echo        }
echo    }
echo.
echo    # Ativar site
echo    sudo ln -s /etc/nginx/sites-available/txopela /etc/nginx/sites-enabled/
echo    sudo nginx -t
echo    sudo systemctl restart nginx
echo.
echo 6. INICIAR BACKEND:
echo    cd /var/www/txopela/backend
echo    source venv/bin/activate
echo    gunicorn --workers 3 --bind 0.0.0.0:8000 txopela_backend.wsgi:application
echo.
echo 7. TESTAR:
echo    # Acesse no navegador:
echo    http://75.119.133.19
echo.
echo ========================================
echo   COMANDOS RAPIDOS PARA VPS
echo ========================================
echo.
echo # Para criar servico automatico (opcional):
echo sudo nano /etc/systemd/system/txopela.service
echo.
echo # Conteudo do arquivo:
echo [Unit]
echo Description=Txopela Tour Backend
echo After=network.target
echo.
echo [Service]
echo User=www-data
echo Group=www-data
echo WorkingDirectory=/var/www/txopela/backend
echo Environment="PATH=/var/www/txopela/backend/venv/bin"
echo ExecStart=/var/www/txopela/backend/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:8000 txopela_backend.wsgi:application
echo.
echo [Install]
echo WantedBy=multi-user.target
echo.
echo # Comandos do servico:
echo sudo systemctl daemon-reload
echo sudo systemctl start txopela
echo sudo systemctl enable txopela
echo sudo systemctl status txopela
echo.
pause