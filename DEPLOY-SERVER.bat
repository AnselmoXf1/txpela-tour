@echo off
echo ========================================
echo   DEPLOY SERVER - TXOPELA TOUR
echo ========================================
echo.
echo Este script vai preparar o servidor para produção.
echo.

echo 1. Atualizando dependências do Backend...
cd backend
call venv\Scripts\activate
pip install -r requirements.txt --upgrade

echo.
echo 2. Aplicando migrações...
python manage.py makemigrations
python manage.py migrate

echo.
echo 3. Coletando arquivos estáticos...
python manage.py collectstatic --noinput

echo.
echo 4. Instalando dependências do Business App...
cd ..\business-app
call npm install --production

echo.
echo 5. Build do Business App...
call npm run build

echo.
echo 6. Instalando dependências do Client App...
cd ..\frontend-vite
call npm install --production

echo.
echo 7. Build do Client App...
call npm run build

echo.
echo ========================================
echo   DEPLOY CONCLUÍDO!
echo ========================================
echo.
echo Para iniciar em produção:
echo.
echo 1. Backend (Gunicorn + Nginx):
echo    cd backend
echo    gunicorn txopela_backend.wsgi:application --bind 0.0.0.0:8000
echo.
echo 2. Servir arquivos estáticos:
echo    nginx config em: backend/nginx.conf
echo.
echo 3. Business App (servido pelo Nginx):
echo    Arquivos em: business-app/dist
echo.
echo 4. Client App (servido pelo Nginx):
echo    Arquivos em: frontend-vite/dist
echo.
echo ========================================
echo   CONFIGURAÇÃO NGINX
echo ========================================
echo.
echo Crie o arquivo /etc/nginx/sites-available/txopela:
echo.
echo server {
echo     listen 80;
echo     server_name seu-dominio.com;
echo     
echo     # Backend API
echo     location /api/ {
echo         proxy_pass http://localhost:8000;
echo         proxy_set_header Host $host;
echo         proxy_set_header X-Real-IP $remote_addr;
echo     }
echo     
echo     # Business App
echo     location /business/ {
echo         root /caminho/para/business-app/dist;
echo         try_files $uri $uri/ /index.html;
echo     }
echo     
echo     # Client App
echo     location / {
echo         root /caminho/para/frontend-vite/dist;
echo         try_files $uri $uri/ /index.html;
echo     }
echo }
echo.
pause